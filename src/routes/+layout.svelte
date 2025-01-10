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
