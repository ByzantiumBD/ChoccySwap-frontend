<script lang="ts">
	import { getConnection } from '$lib/interactions/connection';
	import { getAllOrdersByPriceRange } from '$lib/interactions/queries';
	import { calcPrice, PRICE_PRECISION } from '$lib/interactions/swaps';
	import type { Pair } from '$lib/types';
	import { createAmountFromBalance, type Connection } from '@chromia/ft4';
	import { onMount } from 'svelte';

	type OrderInfo = {
		number: string;
		volume: string;
		priceRange: string;
		width: number;
	};
	type OrderInfoRaw = {
		number: number;
		volume: bigint;
		priceRange: string;
	};

	let { sell = false, pairPromise }: { sell?: boolean; pairPromise: Promise<Pair> } = $props();
	
	let order0: OrderInfo | undefined = $state(undefined);
	let order1: OrderInfo | undefined = $state(undefined);
	let order2: OrderInfo | undefined = $state(undefined);
	let order3: OrderInfo | undefined = $state(undefined);
	let order4: OrderInfo | undefined = $state(undefined);
	let order5: OrderInfo | undefined = $state(undefined);

	let all: Array<OrderInfo|undefined> = $derived([order0, order1, order2, order3, order4, order5]);

	let connection: Connection | undefined = $state(undefined);

	async function getOrders(pair: Pair) {
		await Promise.all(all.map((_, i) => getOrdersInRange(pair, i)));
	}

	async function getOrdersInRange(pair: Pair, idx: number) {
		if (!connection) return;
		const currPrice = calcPrice(pair.amount1, pair.amountCcy);
		let limitPrice = 0n;
		if (idx === 5) {
			limitPrice = sell ? PRICE_PRECISION * PRICE_PRECISION : 0n;
		} else {
			limitPrice = (currPrice * (10n + (sell ? BigInt(idx + 1) : -BigInt(idx + 1)))) / 10n;
		}

		const one = sell ? currPrice : limitPrice;
		const two = sell ? limitPrice : currPrice;

		let paginator = await getAllOrdersByPriceRange(connection, pair.asset1, one, two);

		let info: OrderInfoRaw = {
			number: 0,
			volume: 0n,
			priceRange: (sell ? '+' : '-') + (idx + 1) * 10 + '%'
		};

		let finished = false;

		while (!finished) {
			paginator.data.map((o) => {
				info.number += 1;
				info.volume += o.amount.value;
			});
			if (paginator.hasMore) {
				paginator = await paginator.loadMore();
			} else {
				finished = true;
			}

			const expected = sell ? pair.ccy : pair.asset1;

			updateOrderX(idx, {
				number: '' + info.number,
				volume: createAmountFromBalance(
					info.volume,
					expected.decimals
				).toString() + " " + expected.symbol,
				priceRange: info.priceRange,
				width: 0
			});
		}
	}

	function updateOrderX(idx: number, x: OrderInfo){
		switch (idx) {
			case 0:
				order0 = x
				break;
			case 1:
				order1 = x
				break;
			case 2:
				order2 = x
				break;
			case 3:
				order3 = x
				break;
			case 4:
				order4 = x
				break;
			case 5:
				order5 = x
				break;
		
			default:
				throw "what"
		}
	}

	onMount(async () => {
		connection = await getConnection();
		pairPromise.then(getOrders);
	});
</script>

<div class="flex flex-col grow {sell ? 'border-r' : ''} border-[#fff5]">
	<h3
		class="bg-[#0008] title {sell
			? 'sell'
			: ''} p-3 text-2xl font-bold allcenter underline decoration-2"
	>
		{sell ? 'Selling' : 'Buying'} Orders
	</h3>
	<div
		class="flex {sell
			? ''
			: 'flex-row-reverse'} items-center justify-around opacity-50 text-lg py-2"
	>
		<span>Number of Orders</span>
		<span>Volume</span>
		<span>Price Range</span>
	</div>
	<hr class="border-gray-600 border-1" />
	{#snippet section(order: OrderInfo | undefined)}
		<div 
			style="--width:{order?.width ?? 0};--color:{sell ? '#8eeafc88' : '#ed32bf88'};--right:{sell
				? '0'
				: ''};--left:{sell ? '' : '0'};"
			class="orders {sell? '' : 'flex-row-reverse'} flex items-center justify-around text-lg py-4"
		>
			<span class="O"> {order?.number ?? '...'} </span>
			<span class="V"> {order?.volume ?? '...'} </span>
			<span class="P"> {order?.priceRange ?? '...'} </span>
		</div>
	{/snippet}
	{@render section(order0)}
	{@render section(order1)}
	{@render section(order2)}
	{@render section(order3)}
	{@render section(order4)}
	{@render section(order5)}
</div>

<style>
	.orders:hover {
		background-color: #0004;
	}
	span {
		flex-grow: 1;
		flex-basis: 1px;
		text-align: center;
	}
	.title {
		border-radius: 0 1.5rem 0 0;
		text-decoration-color: #ed32bf;
		&.sell {
			border-radius: 1.5rem 0 0 0;
			text-decoration-color: #8eeafc;
		}
	}
	.orders {
		--width: 50%;
		position: relative;
		&::before {
			z-index: -1;
			position: absolute;
			right: var(--right);
			left: var(--left);
			background-color: var(--color);
			width: var(--width);
			top: 0;
			height: 100%;
			content: '';
		}
	}
</style>
