<script lang="ts">
	import logo from '$lib/images/common/logo.svg';
	import writing from '$lib/images/common/writing.svg';
	import menu from '$lib/images/common/menu.svg';
	import type { Session } from '@chromia/ft4';
	import { alerter, shortenId, updateBalances } from '$lib/utils';
	import { mint } from '$lib/interactions/account';
	import { getSessionOrConnect } from '$lib/interactions/connection';

	let { isSwap } = $props();
	let menuDiv: HTMLDivElement;
	let session: Session | undefined = $state(undefined);

	let text: string = $state('Get funds for testing');
	let hideMinter = $state(false);

	async function connect() {
		session = await getSessionOrConnect();
		updateBalances();
	}
	function getBalance() {
		text = 'Receiving funds...';
		mint(session!)
			.then(() => {
				text = 'Assets received!';
				updateBalances();
				new Promise<void>((resolve) => {
					setTimeout(() => {
						hideMinter = true;
						resolve();
					}, 3000);
				});
			})
			.catch((e) => {
				text = 'Error!';
				new Promise<void>((resolve) => {
					setTimeout(() => {
						text = 'Get funds for testing';
						resolve();
					}, 3000);
				});
				alerter(e);
			});
	}

	function toggleMenu() {
		if (menuDiv.classList.contains('open')) menuDiv.classList.remove('open');
		else menuDiv.classList.add('open');
	}
</script>

<div id="positioner" class="absolute w-full z-10">
	<div id="header" class="allcenter bg-transparent text-white py-3 px-7">
		<div id="header-content" class="allcenter max-w-[1200px] w-full">
			<a href="/" id="brand" class="allcenter">
				<img src={logo} alt="logo" class="h-[50px]" />
				<img src={writing} alt="choccyswap" class="h-[30px] px-3" />
			</a>
			<div class="max-[599px]:hidden allcenter ml-auto">
				<div id="links" class="allcenter ml-auto space-x-8 font-medium">
					<a href="/pools" class=""> Pools </a>
				</div>
				{#if isSwap}
					{#if session}
						{#if !hideMinter}
							<button onclick={getBalance}>
								{text}
							</button>
						{/if}
						<div class="pinkbutton py-1.5 px-7 font-semibold ml-8">
							{shortenId(session.account.id)}
						</div>
					{:else}
						<button onclick={connect} class="pinkbutton py-1.5 px-7 font-semibold ml-8">
							Connect Wallet
						</button>
					{/if}
				{:else}
					<div id="links" class="allcenter ml-auto space-x-8 font-medium">
						<a href="/pools" class=""> Pools </a>
					</div>
					<a href="/swap" class="pinkbutton py-1.5 px-7 font-semibold ml-8"> Swap Now </a>
				{/if}
			</div>

			<div class="min-[600px]:hidden ml-auto relative">
				<button onclick={toggleMenu}>
					<img src={menu} alt="menu" class="text-white" />
				</button>

				<div
					bind:this={menuDiv}
					id="topbarmenu"
					class="min-[600px]:!hidden absolute top-full right-0 p-3 gap-3 w-[500%]"
				>
					{#if isSwap}
						{#if session}
							{#if !hideMinter}
								<button onclick={getBalance}>
									{text}
								</button>
							{/if}
							<div class="pinkbutton py-1.5 px-7 font-semibold">
								{shortenId(session.account.id)}
							</div>
						{:else}
							<button onclick={connect} class="pinkbutton py-1.5 px-7 font-semibold">
								Connect Wallet
							</button>
						{/if}
					{:else}
						<a href="/pools" class=""> Pools </a>
						<a href="/swap" class="pinkbutton py-1.5 px-7 font-semibold"> Swap Now </a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="less">
	#header::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		backdrop-filter: blur(5.538px);
	}

	#topbarmenu {
		display: none;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			background-color: #ed32bf22;
			border-radius: 5mm;
			backdrop-filter: blur(5.538px);
		}
	}

	:global(body) {
		font-family: Roboto, sans-serif;
	}
</style>
