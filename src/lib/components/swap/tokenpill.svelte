<script lang="ts">
	import type { Asset } from '@chromia/ft4';
	import Tokenimg from '$lib/components/swap/tokenimg.svelte';
	import type { BufferId } from 'postchain-client';

	interface Props {
		asset: Asset;
		selectToken: (a: BufferId) => void;
	}

	let { asset, selectToken }: Props = $props();

	function onclick() {
		selectToken(asset.id);
	}
</script>

<button {onclick} class="clickable allcenter shrink-0 border-[1px] border-gray-600 rounded-3xl py-2 px-3">
	<Tokenimg class="w-[28px] h-[28px] mr-2" src={asset.iconUrl} alt="token" />
	<span class="text-white font-bold text-sm">{asset.name}</span>
</button>

<style>	
</style>