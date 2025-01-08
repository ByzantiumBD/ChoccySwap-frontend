<script lang="ts">
	import Background from '$lib/components/background.svelte';
	import '@fontsource/roboto';
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	let { children } = $props();

	let isSwap = $derived(page.url.pathname.match(/swap/i) !== null);
</script>

<div class="overflow-hidden relative bg-black min-h-screen flex flex-col justify-between">
	<Header {isSwap} />

	<Background>
		{@render children()}
	</Background>

	{#if !isSwap}
		<Footer/>
	{/if}
</div>
