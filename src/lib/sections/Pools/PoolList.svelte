<script lang="ts">
	import PoolEntry from '$lib/components/pools/PoolEntry.svelte';
	import PoolSearchBar from '$lib/components/pools/PoolSearchBar.svelte';
	import { getConnection } from '$lib/interactions/connection';
	import { getAllPairsByLiquidity } from '$lib/interactions/queries';
	import { getCcy, sequentialize } from '$lib/interactions/utils';
	import type { Pair } from '$lib/types';
	import { getId, isVerified } from '$lib/utils';
	import { onMount } from 'svelte';

	let allPairs: Array<Pair> = $state([]);
	let shownPairs: Array<Pair> = $state([]);
	let _filtered = $state(true);
	let _query = $state('');

	const filters = {
		get verified() {
			return _filtered;
		},
		set verified(x: boolean) {
			_filtered = x;
			updatePairs();
		},
		get query() {
			return _query;
		},
		set query(x: string) {
			_query = x.toLowerCase();
			updatePairs();
		}
	}

	function updatePairs() {
		shownPairs = allPairs.filter(showPair)
	}

	function showPair(p: Pair) {
		if (_filtered && !isVerified(p.id)) return false;
		if (_query) {
			if (
				p.asset1.name.toLowerCase().includes(_query) ||
				p.asset1.symbol.toLowerCase().includes(_query) ||
				getId(p.asset1.id).includes(_query)
			) return true;
			return false;
		}
		return true;
	}

	onMount(async () => {
		const ccy = await getCcy();
		const nextPool = sequentialize(await getAllPairsByLiquidity(ccy, await getConnection()));

		let lastPair = undefined;
		do {
			lastPair = await nextPool();
			if (lastPair !== undefined) {
				allPairs.push(lastPair);
				if (showPair(lastPair)) shownPairs.push(lastPair);
			}
		} while (lastPair !== undefined);
	});
</script>

<div class="max-w-[1000px] h-screen w-full flex flex-col">
	<div class="allcenter mx-5 mt-32 mb-8 !justify-between">
		<h1 class="grow basis-1 text-5xl font-bold text-white">Pools</h1>
		<PoolSearchBar {filters} />
	</div>

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
		{#each shownPairs as pair (getId(pair.id))}
			<PoolEntry {pair} />
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
	.money > span {
		flex: 1 0 1px;
	}
</style>
