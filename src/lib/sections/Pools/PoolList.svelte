<script lang="ts">
  	import PoolEntry from '$lib/components/pools/PoolEntry.svelte';
	import { getConnection } from '$lib/interactions/connection';
	import { getAllPairsByLiquidity } from '$lib/interactions/queries';
	import { getCcy, sequentialize } from '$lib/interactions/utils';
	import type { Pair } from '$lib/types';
	import { onMount } from 'svelte';

	let allPairs: Array<Pair> = $state([])

	onMount(async()=>{
		const ccy = await getCcy();
		const nextPool = sequentialize(
			await getAllPairsByLiquidity(ccy, await getConnection())
		)

		let allPairs = [];
		let lastPair = undefined;
		do {
			lastPair = await nextPool();
			if (lastPair !== undefined) {
				allPairs.push(lastPair);
			}
		} while (lastPair !== undefined);
		reloadPairs(allPairs);
	})

	function reloadPairs(p: Pair[]) {
		allPairs = p;
	}
</script>

<div class="max-w-[1000px] h-screen w-full flex flex-col">
	<h1 class="self-center mt-20 mb-8 text-5xl font-bold text-white">
		Pools
	</h1>
	
	<div class="header px-5 flex self-stretch text-white opacity-50 text-lg mb-3">
		<div class="identifier flex basis-1 grow">
			<span class="logo mr-4">Logo</span>
			<span class="name mr-1">Name</span>
			<span class="ticker">(Ticker)</span>
		</div>
		<div class="money flex basis-1 grow mr-[40px]">
			<span class="address">Address</span>
			<span class="tvl">TVL (CCY)</span>
			<span class="price">Price</span>
		</div>
	</div>
	<div class="overflow-y-scroll mb-auto">
		{#each allPairs as pair}
			<PoolEntry {pair}/>
		{/each}
	</div>
	<div class="foot my-8 text-sm text-white text-center opacity-50">
		All tokens are paired against Choccy. All prices are estimates. Trade at your own risk.
	</div>
</div>


<style>
	span {
		text-align: center;
	}
	.logo {
		width: 45px;
	}
	.money > span{
		margin: 0 auto;
	}
</style>