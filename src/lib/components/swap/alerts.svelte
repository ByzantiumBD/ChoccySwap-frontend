<script lang="ts">
	import Close from '$lib/images/swap/close.svelte';
	import type { AlertType } from '$lib/types';
	import { onMount } from 'svelte';
	import doneSvg from '$lib/images/swap/done.svg';
	import copySvg from '$lib/images/swap/copy.svg';
	import externalSvg from '$lib/images/common/externallink.svg';

	let { isError, text, ttl, kill, link }: AlertType & { kill: () => void } = $props();
	let clicked: boolean = $state(false);
	let mouseOver: boolean = $state(false);

	const LIFESPAN = 5000;
	const DELTA_T = 30;

	let width = $derived(ttl + '%');

	function copy() {
		navigator.clipboard.writeText(text);
		clicked = true;
	}

	function onmouseenter() {
		mouseOver = true;
	}
	function onmouseleave() {
		mouseOver = false;
	}

	onMount(() => {
		const dt = (DELTA_T * 100) / LIFESPAN;
		const i = setInterval(() => {
			if (mouseOver) return;
			ttl -= dt;
			if (ttl <= 0) {
				kill();
				clearInterval(i);
			}
		}, DELTA_T);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	{onmouseenter}
	{onmouseleave}
	class="allcenter z-20 !items-stretch flex-col {isError
		? 'bg-[#ed32bf] text-white'
		: 'bg-[#1a1a1a] text-[#8eeafc]'} p-4 mt-5 rounded-3xl w-[20rem]"
>
	<div class="allcenter">
		<span class="font-extrabold text-2xl mr-auto">{isError ? 'Error!' : 'Success!'}</span>
		{#if isError}
			<button onclick={copy} aria-label="copy error">
				<img src={clicked? doneSvg : copySvg} alt="copy" class="w-[20px] h-[20px] mr-2"/>
			</button>
		{:else}
			<a href={link} target="_blank" aria-label="open explorer">
				<img src={externalSvg} alt="copy" class="w-[20px] h-[20px] mr-2"/>
			</a>
		{/if}
		<button onclick={kill}>
			<Close style="width:25px; height:25px; fill:#fff9" />
		</button>
	</div>
	<div>
		<span class="font-base text-base opacity-70 break-all">
			{text}
		</span>
	</div>
	<div class="relative my-3">
		<div
			style="width:{width}"
			id="timer"
			class="{isError ? 'bg-white' : 'bg-[#8eeafc]'} h-[5px] rounded-xl"
		></div>
	</div>
</div>

<style>
	#timer {
		position: absolute;
		left: 0;
	}
</style>

