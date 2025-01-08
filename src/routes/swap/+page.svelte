<script lang="ts">
	import { onMount } from "svelte";

	let target = new Date("2025-01-10T12:00:00Z")
	let time = $state(target.valueOf() - new Date().valueOf())


	const MILLIS_PER_HOUR = 60*60*1000
	const MILLIS_PER_MINUTE = 60*1000
	function splitTimeDiff(time: number) {
		let hours = Math.floor(time / MILLIS_PER_HOUR)
		let t = time - hours * MILLIS_PER_HOUR
		let minutes = Math.floor(t / MILLIS_PER_MINUTE)
		t -= minutes * MILLIS_PER_MINUTE
		let seconds = Math.floor(t / 1000)
		return {
			hours: twoDigits(hours), 
			minutes: twoDigits(minutes), 
			seconds: twoDigits(seconds)
		}
	}
	function twoDigits(num: number) {
		let n = num.toString();
		return n.length === 2? n : '0'+n
	}

	let timeDiff = $derived(splitTimeDiff(time))

	onMount(() => {
		const interval = setInterval(() => {
			time = target.valueOf() - new Date().valueOf();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="overflow-hidden absolute bg-black w-screen min-h-screen flex flex-col justify-between">
	<p class="timer allcenter">{timeDiff.hours}:{timeDiff.minutes}:{timeDiff.seconds}</p>
	<p class="phase allcenter">Phase 1/4</p>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	p {
		color: #b5178e;
		font-weight: 900;
		font-size: 70pt;
		&.timer {
			font-size: 90pt;
		}
	}
	@media(max-width: 520px) {
		p.timer {
			font-size: 50pt !important;
		}
		p.phase {
			font-size: 30pt !important;
		}
	}
	@media(max-width: 780px) {
		p.timer {
			font-size: 70pt;
		}
		p.phase {
			font-size: 50pt;
		}
	}
</style>