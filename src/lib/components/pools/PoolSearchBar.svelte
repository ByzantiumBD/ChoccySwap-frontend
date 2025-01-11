<script lang="ts">
	import searchSvg from '$lib/images/swap/search.svg';
	import Filter from '$lib/images/swap/filter.svelte';
	type Props = {
		filters: { verified: boolean, query: string }
	};

	let { filters = $bindable() }: Props = $props();

	let input: HTMLInputElement | undefined = $state(undefined);

	function onclick() {
		if (input) input.focus()
	}
</script>

<div class=" basis-1 grow flex items-center">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div {onclick} class="gradientborder allcenter px-5 py-2 space-x-auto mr-3 grow">
		<input bind:this={input} bind:value={filters.query} placeholder="Search a token" />
		<img class="w-[30px] h-[30px]" src={searchSvg} alt="search" />
	</div>
	<button
		class="{filters.verified
			? 'pink'
			: 'black'} text-sm allcenter p-[0.08rem_0_0_0.08rem] relative rounded-full w-[35px] h-[35px]"
		onclick={() => (filters.verified = !filters.verified)}
	>
		<Filter />
	</button>
</div>

<style lang="less">
	input {
		all: unset;
		flex-grow: 1;
		background-color: transparent;
		color: white;

		&::placeholder {
			color: #fff8;
		}
		&:focus {
			outline: none;
			box-shadow: unset;
		}
	}

	.gradientborder {
		border-radius: 60cm;
		border: solid 1px transparent;
		background:
			linear-gradient(to right, #101010 0%, #101010 100%) padding-box,
			linear-gradient(to right, #ed32bf 0%, #8eeafc 100%) border-box;
	}

	button.black {
		background-color: black;
		fill: #fff8;
	}
	button.pink {
		background-color: #ff9ced;
		fill: black;
	}
	button:hover::before {
		content: 'Show only verified tokens';
		position: absolute;
		bottom: 100%;
		left: -225%;
		background-color: black;
		color: white;
		border-radius: 20px;
		width: 550%;
		padding: 5px;
	}
</style>
