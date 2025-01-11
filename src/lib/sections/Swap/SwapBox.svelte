<script lang="ts">
	import Settings from '$lib/components/swap/settings.svelte';
	import Swapinput from '$lib/components/swap/swapinput.svelte';
	import Tokens from '$lib/components/swap/tokens.svelte';
	import cog from '$lib/images/swap/cog.svg';
	import switcharrow from '$lib/images/swap/switch.svg';
	import { getConnection, getSession } from '$lib/interactions/connection';
	import { getPairs, getTokenInfo } from '$lib/interactions/utils';
	import { calcInput, calcOutput, getCorrectSwapOperation } from '$lib/interactions/routes';
	import type { Pair, TokenInfo } from '$lib/types';
	import { getId, isCcy, setUpdater } from '$lib/utils';
	import { makeNumberReadable } from '$lib/number-utils';
	import { createAmount, createAmountFromBalance, getAssetById, type Amount, type TransactionWithReceipt } from '@chromia/ft4';
	import { onMount, untrack } from 'svelte';
	import { SwapError } from '$lib/errors';
	import { calcImpact } from '$lib/interactions/swaps';
	import { TxRejectedError, type BufferId } from 'postchain-client';

	let { success }: { success: (msg: string, link: string) => void } = $props();

	const MILLIS_PER_MINUTE = 60 * 1000;

	let isTokensHidden = $state(true);
	let isSettingsHidden = $state(true);

	let slippage: number = $state(5);
	let deadline: number = $state(20);
	let impact: number = $state(0);

	let currentlyChoosingInputToken: boolean = $state(true);
	let lastEditedInput: boolean = $state(true);
	let isCalculating: boolean = $state(false);

	let token1: TokenInfo | undefined = $state(undefined);
	let token2: TokenInfo | undefined = $state(undefined);

	let _input1: Amount = $state(createAmount(0, 0));
	let _input2: Amount = $state(createAmount(0, 0));
	let input1: Amount = $state(createAmount(0, 0));
	let input2: Amount = $state(createAmount(0, 0));

	let canSwap: boolean = $derived.by(() => {
		if (!token1 || !token2) return false;
		if (_input1.value > token1.amountOwned.value) return false;
		if (_input1.value <= 0n) return false;
		return true
	})

	$effect(()=>{
		if (isCalculating) return;
		checkInputs(input1, input2);
	})

	let pair1: Pair | undefined = $state(undefined);
	let pair2: Pair | undefined = $state(undefined);

	function switchTokens() {
		let t = token1;
		token1 = token2;
		token2 = t;
		let v = input1;
		input1 = input2;
		input2 = v;
		let p = pair1;
		pair1 = pair2? pair2: pair1;
		pair2 = pair2? p : undefined;

		isCalculating = true;
		
		lastEditedInput = !lastEditedInput;
		if (lastEditedInput) {
			_input1 = _input2;
		} else {
			_input2 = _input1;
		}

		updateQueryParams();
		updateInputs(lastEditedInput).then(() => isCalculating = false);
	}

	function closeTokens() {
		isTokensHidden = true;
	}
	function openTokens(isInput: boolean) {
		isTokensHidden = false;
		currentlyChoosingInputToken = isInput;
	}

	function closeSettings() {
		isSettingsHidden = true;
	}
	function openSettings() {
		isSettingsHidden = false;
	}

	async function selectToken(newId: BufferId) {
		const newAssId = getId(newId);
		const token1Id = token1 ? getId(token1.asset.id) : '';
		const token2Id = token2 ? getId(token2.asset.id) : '';
		const conn = await getConnection();
		const asset = await getAssetById(conn, newAssId)
		if (!asset) return;
		if (currentlyChoosingInputToken) {
			if (newAssId == token2Id) switchTokens();
			else if (newAssId !== token1Id) {
				token1 = await getTokenInfo(getSession(), asset);
			} else {  
				closeTokens();
				return;
			}
		} else {
			if (newAssId == token1Id) switchTokens();
			else if (newAssId !== token2Id) {
				token2 = await getTokenInfo(getSession(), asset);
			} else {  
				closeTokens();
				return;
			}
		}
		const pairs = await getPairs(await getConnection(), token1?.asset, token2?.asset);
		pair1 = pairs.pair1;
		pair2 = pairs.pair2;
		closeTokens();

		updateInputs(lastEditedInput)
		updateQueryParams();
	}

	function updateQueryParams() {
		const url = new URL(window.location.href);
		if(token1) {
			url.searchParams.set("input", getId(token1?.asset.id))
		} else if (url.searchParams.get("input")) {
			url.searchParams.delete("input")
		}
		if(token2) {
			url.searchParams.set("output", getId(token2?.asset.id))
		} else if (url.searchParams.get("output")) {
			url.searchParams.delete("output")
		}
		history.pushState(null, '', url);
	}

	async function loadQueryParams() {
		const url = new URL(window.location.href);
		const inp = url.searchParams.get("input")
		const outp = url.searchParams.get("output")
		
		if (inp) {
			currentlyChoosingInputToken = true;
			await selectToken(inp)
		}
		if (outp) {
			currentlyChoosingInputToken = false;
			await selectToken(outp)
		}
	}

	async function swap() {
		const session = getSession();
		if (!session) throw new SwapError('Connect before using the dapp');
		if (!token1) throw new SwapError('Token 1 is not defined');
		if (!token2) throw new SwapError('Token 2 is not defined');

		const swapDeadline = Date.now() + deadline*MILLIS_PER_MINUTE;
		const slipPrecision = 100000;
		const slip = BigInt((100-slippage)*slipPrecision);

		let txReceipt: TransactionWithReceipt;
		try {
			txReceipt = await session.call(
				getCorrectSwapOperation(
					pair1,
					pair2,
					isCcy(token2.asset),
					_input1,
					createAmountFromBalance(
						(_input2.value * slip)/(100n*BigInt(slipPrecision)),
						_input2.decimals
					),
					swapDeadline
				)
			)
		} catch (e) {
			if (
				e instanceof TxRejectedError &&
				e.message.match(/Amount received too small, the price went out of range/i)
			) {
				throw new SwapError("The price of the token changed too suddenly. The swap operation reverted due to your slippage settings.")
			}
		}

		const txRid = txReceipt!.receipt.transactionRid;

		updateBalances();
		success(
			"Swap succeeded!",
			"https://explorer.chromia.com/testnet/FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/" + getId(txRid)
		);
	}

	async function updateInputs(changedInput: boolean) {
		if (token1 && token2) {			
			if (changedInput) {
				_input1 = createAmount(input1.toString(), token1.asset.decimals);
				const output = await calcOutput(
					await getConnection(),
					_input1,
					isCcy(token1.asset),
					pair1,
					pair2
				)
				input2 = output;
				_input2 = output;
			} else {
				_input2 = createAmount(input2.toString(), token2.asset.decimals);
				const input = await calcInput(
					await getConnection(),
					_input2,
					isCcy(token1.asset),
					pair1,
					pair2
				)
				input1 = input;
				_input1 = input;
			}
			if (_input1.value !== 0n && _input2.value !== 0n){
				impact = Number(makeNumberReadable(calcImpact(
					pair1,
					pair2,
					_input1.value,
					_input2.value,
					isCcy(token2.asset)
				).toString()))
			} else {
				impact = 0;
			}
		}
	}

	function checkInputs(input1: Amount, input2: Amount) {
		if (untrack(()=>_input1).value !== input1.value) {
			lastEditedInput = true;
			updateInputs(untrack(()=>lastEditedInput))
		} else if (untrack(()=>_input2).value !== input2.value) {
			lastEditedInput = false;
			updateInputs(untrack(()=>lastEditedInput))
		}
	}

	async function updateBalances() {
		if (token1) await getTokenInfo(getSession(), token1?.asset).then((a) => (token1 = a));
		if (token2) await getTokenInfo(getSession(), token2?.asset).then((a) => (token2 = a));
	}

	onMount(async () => {
		await getConnection()
		setUpdater(updateBalances);
		loadQueryParams();
	});
</script>

<div
	id="mainbox"
	class="allcenter flex-col min-w-[600px]:w-[600px] mx-2 border border-gray-600 rounded-3xl my-[3cm] py-5 text-white"
>
	<div class="allcenter !justify-between w-full px-6">
		<h1 class="text-3xl font-extrabold">Swap</h1>
		<button onclick={openSettings} class="clickable w-[30px]"> <img src={cog} alt="slippage menu" /></button>
	</div>

	<div class="allcenter relative flex-col w-full px-4 mt-4">
		<Swapinput {openTokens} isInput={true} tokenInfo={token1} bind:value={input1} />

		<div
			id="switch-background"
			class="absolute allcenter bg-[#303030] w-[2cm] h-[2cm] rounded-full border-[#682c5a] border-2"
		>
			<button onclick={switchTokens} class="bg-[#101010] clickable w-[1.5cm] h-[1.5cm] rounded-full">
				<img src={switcharrow} alt="switch" />
			</button>
		</div>

		<Swapinput {openTokens} isInput={false} tokenInfo={token2} bind:value={input2} />
	</div>

	{#if token1 && token2}
		<div class="info flex items-stretch flex-col self-stretch mx-8 text-sm mt-2">
			<div class="flex justify-between max-[730px]:flex-col">
				<span>
					Swap {makeNumberReadable(input1.toString())}
						 {token1?.asset.symbol} 
					for {makeNumberReadable(input2.toString())}
						{token2?.asset.symbol}
				</span>
				<span class="{impact > 10? "danger": ""}">Price Impact: {impact}%</span>
			</div>
			<div class="flex justify-between max-[730px]:flex-col">
				<span>Slippage: {slippage}%</span>
				<span>Deadline: {deadline} minutes</span>
			</div>
		</div>
	{/if}

	<div class="allcenter w-full px-4 mt-3">
		<button onclick={swap} id="swapbutton" disabled={!canSwap}
			class="clickable p-3 rounded-full w-full text-xl font-extrabold">
			Swap
		</button>
	</div>
</div>

<Tokens close={closeTokens} isHidden={isTokensHidden} {selectToken} />
<Settings close={closeSettings} isHidden={isSettingsHidden} bind:slippage bind:deadline />

<style>
	#mainbox {
		background-image: radial-gradient(#303030 0, #303030 2cm, #101010);
	}

	#swapbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
	}
	#swapbutton:disabled {
		background: linear-gradient(to right, #fff1 0, #fff2 100%);
		color: #fff8;
	}
	#switch-background {
		--top: calc(50% - 0.25rem);
		--bottom: calc(50% + 0.25rem);
		--right: calc(100% - 3px);
		z-index: 1;
		clip-path: polygon(
			0 var(--top),
			2px var(--top),
			2px var(--bottom),
			0 var(--bottom),
			0% 100%,
			100% 100%,
			100% var(--bottom),
			var(--right) var(--bottom),
			var(--right) var(--top),
			100% var(--top),
			100% 0,
			0 0
		);
	}
	.info span {
		opacity: 50%;
	}

	span.danger {
		color: #ed32bf;
		opacity: 90%;
	}
</style>
