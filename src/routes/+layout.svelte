<script lang="ts">
	import Background from '$lib/components/common/background.svelte';
	import '@fontsource/roboto';
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/home/footer.svelte';
	import Header from '$lib/components/common/header.svelte';

	let { children } = $props();

	let isSwap = $derived(page.url.pathname.match(/swap/i) !== null);
	let isHome = $derived(page.url.pathname.match(/^\/$/) !== null);
/*
	let target = new Date("2024-12-27T12:00:00Z")
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
	});*/
</script>

<div class="overflow-hidden relative bg-black min-h-screen flex flex-col justify-between">
	<Header {isSwap} />

	<Background>
		{@render children()}
	</Background>

	{#if isHome}
		<Footer/>
	{/if}
</div>
