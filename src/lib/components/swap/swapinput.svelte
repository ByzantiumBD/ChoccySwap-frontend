<script lang="ts">
	import arrow from '$lib/images/common/arrow.svg';
	import Tokenimg from '$lib/components/swap/tokenimg.svelte';
	import type { TokenInfo } from '$lib/types';
	import { makeNumberReadable, removeTrailingZeros, shortenNumber } from '$lib/number-utils';
	import { untrack } from 'svelte';
	import { createAmount, type Amount } from '@chromia/ft4';

	type Props = {
		isInput: boolean;
		openTokens: (isInput: boolean)=>void;
		tokenInfo: TokenInfo | undefined;
		value: Amount;
	}

	let {
		isInput,
		openTokens,
		tokenInfo,
		value = $bindable(),
	}: Props = $props();

	let text = $state("0")

	$effect(() => {
		if (value.value === 0n) {
			text = "";
			return
		}
		const txt = removeTrailingZeros(untrack(()=>text));
		if ((txt? txt:"0") !== value.toString()) {
			text = shortenNumber(value.toString());
		}
	})

	function oninput() {
		let newText = text;
		
		if (newText === ".") newText = "0.";
		// remove leading zeros
		newText = newText.replace(/^0+(?=[1-9])/, "")
		// remove every non-digit besides "."
		newText = newText.replaceAll(/[^0-9.]/g, "")
		// remove all "." after the first
		newText = newText.replaceAll(/(?<=\..*)\./g, "")
		const decimals = newText.match(/\.\d+/g)
		if (decimals && decimals[0]) {
			// decimals contains the dot as well
			const expected = (tokenInfo?.asset.decimals ?? 18) + 1

			if (decimals[0].length >= expected) {
				const integer = newText.match(/^\d*/);
				newText = integer + decimals[0].slice(0, expected)
			}
		}
		const t = removeTrailingZeros(newText);
		value = createAmount(t? t : "0", tokenInfo?.asset.decimals ?? 0);
		text = newText;
	}

	function maxBalance() {
		value = tokenInfo?.amountOwned ?? createAmount(0,0)
	}
</script>

<div
	class="swapinput h-[4cm] w-full {isInput ? 'rounded-t-3xl' : 'rounded-b-3xl'} my-1 px-6"
>
	<div class="floatbox flex flex-col items-start z-1">
		<span class="font-bold pl-3">
			{isInput ? 'You Pay' : 'You Receive'}
		</span>
		<button
			onclick={() => openTokens(isInput)}
			class="clickable allcenter bg-[#101010] rounded-full mt-1 py-2 px-3 font-bold border border-gray-600"
		>
			{#if tokenInfo?.asset !== undefined}
				<Tokenimg
					src={tokenInfo.asset.iconUrl}
					alt="token logo"
					class="ml-1 mr-2"
					style="width:32px;height:32px"
				/>
				{tokenInfo.asset.symbol}
			{:else}
				Choose Token
			{/if}
			<img src={arrow} alt="choose token" class="w-[30px] h-[30px]" />
		</button>
		<button onclick={maxBalance} class="text-sm opacity-50 mt-1 pl-3">Balance: {
			makeNumberReadable(tokenInfo?.amountOwned.toString() ?? "0")
		}</button>
	</div>
	<div class="flex flex-col items-end">
		<input onclick={e => e.currentTarget.select()} type="text" placeholder="0.00" {oninput} bind:value={text}/>
		<!--span class="text-sm opacity-50">${valueInDollars}</span-->
	</div>
</div>

<style lang="less">
	.swapinput {
		background-color: #b5178e30;
		border: 2px solid #ed32bf30;
		position: relative;
		width: 80vw;
		max-width: 600px !important;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	input[type='text'] {
		all: unset;
		background-color: transparent;
		border: none;
		color: white;
		font-size: xx-large;
		text-align: end;
		width: 100%;
		&::placeholder {
			color: #fff8;
		}
		&:focus {
			outline: none;
		}
	}

	@media (max-width: 450px) {
		input[type='text'] {
			font-size: x-large;
		}
	}

	.floatbox {
		position: absolute;
		left: 1.5rem;
		width: 200px;
	}
</style>
