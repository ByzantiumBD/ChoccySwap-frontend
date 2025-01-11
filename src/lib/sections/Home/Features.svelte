<script lang="ts">
	import zerogas from '$lib/images/home/zerogas.svg';
	import compatible from '$lib/images/home/compatible.svg';
	import orderbook from '$lib/images/home/orderbook.svg';
	import announce from '$lib/images/home/announce.svg';

	const feats = [
		{ logo: zerogas, title: 'Zero Gas', desc: 'Using ChoccySwap only involves a liquidity fee.' },
		{
			logo: compatible,
			title: 'FT4 & ERC20 compatible',
			desc: 'You can exchange between FT4 and ERC20 tokens.'
		},
		{
			logo: orderbook,
			title: 'Orderbook Trading',
			desc: "You can trade while you're logged off using the orderbook"
		},

		{
			logo: announce,
			title: 'To be announced',
			desc: 'This feature is going to be announced soon. Stay tuned and follow us to know more!'
		},
		{
			logo: announce,
			title: 'To be announced',
			desc: 'This feature is going to be announced soon. Stay tuned and follow us to know more!'
		},
		{
			logo: announce,
			title: 'To be announced',
			desc: 'This feature is going to be announced soon. Stay tuned and follow us to know more!'
		}
	];
</script>

<div id="Features" class="allcenter mt-[100px] flex-col text-white">
	<span id="gradientbutton" class="py-1 px-3 text-sm mb-2"> Features </span>
	<h1
		class="text-6xl font-bold text-center mb-4 leading-relaxed px-3 max-[860px]:text-5xl max-[860px]:pt-5"
	>
		Unleash the Power of Chromia
	</h1>
	<span class="text-[#fff6] text-lg text-center max-w-[17cm] px-3">
		Empower your trades with next-level efficiency. Experience seamless swapping on a platform build
		for the future of decentralised finance
	</span>

	<div
		class="mt-10 p-6 gap-6 grid grid-cols-3 max-[1230px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:mx-6"
	>
		{#each feats as feat}
			<div class="box-features py-6 px-8 flex flex-col items-start max-w-[11cm]">
				<div class="bg-black rounded-xl p-5 aspect-square">
					<img src={feat.logo} alt="" class="w-[50px] h-[50px]" />
				</div>
				<div class="flex items-start flex-col">
					<h3 class="font-extrabold py-4 text-lg">
						{feat.title}
					</h3>
					<span>
						{feat.desc}
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	#gradientbutton {
		background: linear-gradient(90deg, #ff02d1 0, #8eeafc 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;

		border: 1px solid rgba(255, 156, 237, 0.4);
		border-radius: 60px;
	}

	.box-features {
		background: rgba(255, 2, 209, 0.115);
		backdrop-filter: blur(53.41px);
		border-radius: 32px;
		border: 2.34px solid #ed32bf22;
	}
</style>
