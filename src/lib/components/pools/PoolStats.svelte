<script lang="ts">
	import Tokenimg from '$lib/components/swap/tokenimg.svelte';
	import ext from '$lib/images/common/externallink.svg';
	import { getReadablePrice, getReadableTvlCcy } from '$lib/number-utils';
	import type { Pair } from '$lib/types';
	import { shortenId } from '$lib/utils';
	import type { Asset } from '@chromia/ft4';
	import { onMount } from 'svelte';
	import ReadablePrice from '../common/readablePrice.svelte';

	const NULL_ID = Buffer.from(
		'0000000000000000000000000000000000000000000000000000000000000000',
		'hex'
	);
	const NULL_ASSET: Asset = {
		id: NULL_ID,
		name: '...',
		symbol: '...',
		decimals: 0,
		blockchainRid: NULL_ID,
		iconUrl: '...',
		type: '...',
		supply: 0n
	};

	let { pairPromise }: { pairPromise: Promise<Pair> } = $props();
	let pair: Pair = $state({
		asset1: NULL_ASSET,
		amount1: 0n,
		amountCcy: 0n,
		id: NULL_ID,
		name: '...-...',
		ccy: NULL_ASSET,
		lpToken: NULL_ASSET
	} as Pair);

	onMount(() => {
		pairPromise.then((p) => {
			pair = p;
		});
	});
</script>

<div class="pool_infos bg-[#101010a0] rounded-3xl pb-3">
	<div class="bg-[#0008] self-stretch text-2xl font-bold rounded-t-3xl px-5 py-4">Stats</div>
	<div class="flex items-center p-3 ml-2">
		<Tokenimg class="w-[40px] h-[40px] mr-2" src={pair.asset1.iconUrl} alt="" />
		<span class="font-bold text-2xl mr-auto">{pair.asset1.name}</span>
		<span class="text-lg opacity-50 mr-4">({pair.asset1.symbol})</span>
	</div>

	<hr class="border-1 border-gray-600 mx-3" />

	<div class="flex flex-col items-start justify-center p-3 ml-4">
		<span class="gradientbutton py-1 px-3 my-2 text-sm"> Address</span>
		<a
			class="ml-3 opacity-50 text-xl flex"
			href="https://explorer.chromia.com/testnet/FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/asset/{pair.asset1.id.toString(
				'hex'
			)}"
			target="_blank"
		>
			{shortenId(pair.asset1.id)}
			<img src={ext} class="ml-1 w-[20px]" alt="open in explorer" />
		</a>

		<span class="gradientbutton py-1 px-3 my-2 text-sm"> TVL</span>
		<span class="ml-3 text-3xl font-extrabold flex items-end">
			{getReadableTvlCcy(pair)}
			<span class="opacity-50 text-base ml-1">CCY</span>
		</span>

		<span class="gradientbutton py-1 px-3 my-2 text-sm"> Price</span>
		<span class="ml-3 text-3xl font-extrabold flex items-end">
			<ReadablePrice {...getReadablePrice(pair)} fontSize={1.875} />
			<span class="opacity-50 text-base ml-1">{pair.asset1.symbol}/CCY</span>
		</span>

		<div class="flex items-center">
			<span class="gradientbutton py-1 px-3 my-2 text-sm"> LP Address</span>
			<img class="w-[27px] h-[27px] ml-2" src="https://www.choccyswap.com/logo_lp.svg" alt="lp token"/>
		</div>
		
		<a
			class="ml-3 opacity-50 text-xl flex"
			href="https://explorer.chromia.com/testnet/FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/asset/{pair.lpToken.id.toString(
				'hex'
			)}"
			target="_blank"
		>
			{shortenId(pair.lpToken.id)}
			<img src={ext} class="ml-1 w-[20px]" alt="open in explorer" />
		</a>
	</div>
</div>

<style>
	.pool_infos {
		backdrop-filter: blur(15px);
	}

	.gradientbutton {
		background: linear-gradient(90deg, #ff02d1 0, #8eeafc 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;

		border: 1px solid rgba(255, 156, 237, 0.4);
		border-radius: 60px;
	}
</style>
