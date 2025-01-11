<script lang="ts">
	import arrow from '$lib/images/common/arrowhoriz.svg';
	import link from '$lib/images/common/externallink.svg';
	import pin from '$lib/images/swap/pin.svg';
	import Tokenimg from '$lib/components/swap/tokenimg.svelte';

	import type { Asset } from '@chromia/ft4';
	import type { AssetFilter } from '$lib/types';
	import { getAssetFilter, getId, shortenId } from '$lib/utils';
	import type { BufferId } from 'postchain-client';

	interface Props {
		asset: Asset;
		pinned?: boolean;
		filter: AssetFilter;
		selectToken: (asset: BufferId) => void;
	}

	let { asset, filter, selectToken, pinned = false }: Props = $props();
</script>

<button onclick={()=>selectToken(asset.id)} id="entry" class="{pinned? "pinned" : ""} clickable grow-0 shrink-0 text-[#fff8] allcenter h-[60px] px-5">
	<Tokenimg class="w-[30px] h-[30px] mr-2" src={asset.iconUrl} alt={asset.symbol} />
	<span class="text-sm {filter === getAssetFilter(0)? "text-white" : ""} font-bold mr-1">{asset.name}</span>
	<span class="text-sm {filter === getAssetFilter(1)? "text-white" : ""} font-bold mr-1">({asset.symbol})</span>
	{#if pinned}
		<img class="w-[20px] h-[20px]" src={pin} alt="pinned"/>
	{/if}
	<a class="flex items-center ml-auto" target="_blank" href="https://explorer.chromia.com/testnet/FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/asset/{getId(asset.id)}">
		<span class="text-sm {filter === getAssetFilter(2)? "text-white" : ""}">{shortenId(asset.id)}</span>
		<img class="w-[18px] h-[18px] ml-2" src={link} alt="" />
	</a>
	<img class="w-[30px] h-[30px] ml-3" src={arrow} alt="" />
</button>

<style lang="less">
	#entry {
		background-color: #101010;
		&.pinned {
			background-color: #1a1a1a;
		}
		&:hover {
			background-color: black;
		}
	}
</style>
