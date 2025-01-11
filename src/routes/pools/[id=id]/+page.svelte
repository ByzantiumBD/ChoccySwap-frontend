<script lang="ts">
	import PoolStats from '$lib/components/pools/PoolStats.svelte';
	import type { PageData } from './$types';
	import type { Pair } from '$lib/types';
	import { getPairInfo } from '$lib/interactions/swaps';
	import { getConnection } from '$lib/interactions/connection';
	import OrderList from '$lib/components/pools/OrderList.svelte';

	let { data }: { data: PageData } = $props();

	let id = $derived(data.id);
	let pairPromise: Promise<Pair> = $state(getConnection().then((conn) => getPairInfo(conn, id)));
</script>

<div class="first flex items-stretch basis-1 mt-24 self-stretch px-3 text-white">
	<div class="chart grow-[2] basis-1 mx-2 allcenter rounded-3xl">
		Chart not yet available
	</div>

	<div class="flex flex-col grow basis-1 mx-2 items-stretch">
		<PoolStats {pairPromise} />
		<a
			href="/swap?input={id}"
			class="bgblur p-5 bg-[#ed32bf88] border-2 border-[#ed32bf] text-white font-bold text-xl allcenter clickable self-stretch my-5 rounded-3xl"
		>
			Open on Swap Page
		</a>
	</div>
</div>

<div class="second text-white flex flex-col items-stretch grow basis-1 self-stretch px-3">
	<h1 class="font-bold allcenter text-4xl my-3">Orderbook</h1>
	<div class="flex items-stretch bg-[#101010a0] rounded-3xl bgblur mb-5">
		<OrderList {pairPromise} sell />
		<OrderList {pairPromise} />
	</div>
</div>

<style>
	.bgblur {
		backdrop-filter: blur(15px);
	}
	.chart {
		background-image: radial-gradient(#30303080, #1a1a1a80);
		backdrop-filter: blur(15px);
	}
</style>
