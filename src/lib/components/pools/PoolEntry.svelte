<script lang="ts">
	import arrowhoriz from "$lib/images/common/arrowhoriz.svg"
	import ext from "$lib/images/common/externallink.svg"
	import type { Pair } from "$lib/types";
	import { makeNumberReadable } from "$lib/number-utils";
	import { createAmountFromBalance } from "@chromia/ft4";
	import Tokenimg from "../swap/tokenimg.svelte";
	import { shortenId } from "$lib/utils";

	let { pair }: { pair: Pair } = $props();
</script>

<div class="poolentry flex mb-2 rounded-3xl items-center p-5 text-white text-xl">
	<div class="identifier flex items-center basis-1 grow">
		<Tokenimg class="mr-4 w-[45px] h-[45px]" src={pair.asset1.iconUrl} alt="logo" />
		<div class="name flex">
			<div class="mr-1">{pair.asset1.name}</div>
			<div class="opacity-80">({pair.asset1.symbol})</div>
		</div>
	</div>
	<div class="money flex basis-1 grow items-center">
		<a href="https://explorer.chromia.com/testnet/FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/asset/{
				pair.asset1.id.toString("hex")
			}" target="_blank" class="flex mx-auto text-lg opacity-70">
			<span> {shortenId(pair.asset1.id)} </span>
			<img src={ext} class="ml-1 w-[18px]" alt="open in explorer"/>
		</a>
		<div class="mx-auto ">{
			makeNumberReadable(
				createAmountFromBalance(
					pair.amountCcy*2n,
					pair.ccy.decimals
				).toString()
			)
		}</div>
		<div class="mx-auto ">
			{
				"1.23$"
			}
		</div>
	</div>
	<div class="w-[40px] h-[40px]">
		<img src={arrowhoriz} alt="logo" />
	</div>
</div>

<style lang="less">
	.poolentry {
		backdrop-filter: blur(500px);
		border: solid #1a1a1a 2px;
		position: relative;
		transition: all 0.25s ease;
		text-align: center;
		&::before {
			transition: all 0.25s ease;
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(to left, #ed32bf 0%, #8eeafc 100%);
			opacity: 0%;
		}
		&:hover {
			border: solid #ed32bf 2px;
			&::before {
				opacity: 5%;
			}
		}
	}
</style>
