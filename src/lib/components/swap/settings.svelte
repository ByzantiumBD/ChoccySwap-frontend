<script lang="ts">
	import CloseSvg from '$lib/images/swap/close.svelte';
	import { onMount } from 'svelte';

	let { close, isHidden, slippage = $bindable(), deadline = $bindable() } = $props();

	let lowSlippage: HTMLButtonElement | undefined = $state(undefined),
		zeroFiveSlippage: HTMLButtonElement | undefined = $state(undefined),
		oneSlippage: HTMLButtonElement | undefined = $state(undefined),
		twoSlippage: HTMLButtonElement | undefined = $state(undefined),
		customSlippageButton: HTMLButtonElement | undefined = $state(undefined);

	let buttons: Array<HTMLButtonElement | undefined> = $derived([
		lowSlippage,
		zeroFiveSlippage,
		oneSlippage,
		twoSlippage,
		customSlippageButton
	]);
	let customSlippage: number = $state(0);
	let customSlippageText: string = $state('');
	let slippages: Array<number> = $derived([
		0.1,
		0.5,
		1,
		2,
		customSlippage
	]);
	let currentSlippageIdx: number = $state(0);


	let deadlineText: string = $state('20');

	$effect(() => {
		let text = customSlippageText;

		if (text === '.') text = '0.';
		text = text.replaceAll(/[^0-9.]/g, '');
		text = text.replaceAll(/(?<=\..*)\./g, '');
		customSlippage = Math.min(Number(text), 100);
		if (customSlippage === 100) {
			customSlippageText = "100";
		} else {
			customSlippageText = text.slice(0, 6);
		}
		slippage = slippages[currentSlippageIdx]
	});
	$effect(() => {
		let text = deadlineText;

		text = text.replaceAll(/[^0-9]/g, '');
		deadline = Math.min(100, Math.max(Number(text), 1));
		deadlineText = deadline.toString();
	});

	function selectSlippage(idx: number) {
		buttons[currentSlippageIdx]?.classList.remove('selected');
		buttons[idx]?.classList.add('selected');
		currentSlippageIdx = idx;
		slippage = slippages[idx];
	}

	onMount(() => {
		lowSlippage?.click();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={close}
	class=" {isHidden
		? '!hidden'
		: ''} bg-[#0008] z-10 text-white absolute top-0 left-0 w-screen h-screen allcenter"
>
	<div
		onclick={(e) => e.stopPropagation()}
		class="allcenter flex-col bg-black rounded-3xl border-gray-600 border mx-2"
	>
		<div class="allcenter !justify-between w-full p-5">
			<h2 class="font-extrabold text-xl">Settings</h2>
			<button onclick={close}><CloseSvg style="width:28px; height:28px; fill:#ff9ced" /></button>
		</div>

		<div class="flex flex-col w-full bg-[#101010] p-5 rounded-b-3xl">
			<p class="font-bold mb-3 ml-1">Slippage</p>
			<div id="slippages" class="allcenter !justify-between grid-cols-3">
				<button bind:this={lowSlippage} onclick={() => selectSlippage(0)} class="selected"
					>0.1%</button
				>
				<button bind:this={zeroFiveSlippage} onclick={() => selectSlippage(1)}>0.5%</button>
				<button bind:this={oneSlippage} onclick={() => selectSlippage(2)}>1.0%</button>
				<button bind:this={twoSlippage} onclick={() => selectSlippage(3)}>2.0%</button>
				<button
					bind:this={customSlippageButton}
					onclick={(e) => {
						selectSlippage(4);
						(e.currentTarget.children[0] as HTMLInputElement).focus();
					}}
					class="col-span-2"
					aria-label="Custom"
				>
					<input type="text" placeholder="Custom" bind:value={customSlippageText} />
				</button>
			</div>
			<div class="allcenter mr-3 mt-4">
				<p class="font-bold mb-1 ml-1 mr-auto">Deadline</p>
				<div class="border border-[gray] rounded-3xl py-1 px-2">
					<input type="text"
						style="width:{2}em;text-align:center;"
						bind:value={deadlineText} class="deadline" />
				</div>
				<span class="mx-2">minutes</span>
			</div>
		</div>
	</div>
</div>

<style lang="less">
	input[type='text'] {
		all: unset;
		width: 4rem;
		&::placeholder {
			color: #fff8;
		}
		&:focus {
			outline: none;
		}
	}

	#slippages > button {
		padding: 0.25rem 0.8rem;
		border: solid grey 1px;
		border-radius: 1rem;
		margin: 0 5px 0 5px;
		&.selected {
			background-color: #ed32bf;
			border: solid #ed32bf 1px;
		}
	}

	@media (max-width: 600px) {
		#slippages {
			display: grid !important;
			justify-items: center;
			gap: 0.5rem 0.5rem;
		}
	}
</style>
