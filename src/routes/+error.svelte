<script lang="ts">
</script>

<div id="error" class="text-white allcenter flex-col rounded-3xl p-2">
	<h1
		class="text-6xl font-bold text-center mb-2 leading-relaxed px-3"
	>
		Error!
	</h1>
	<span class="text-[#fffa] text-lg text-center px-3">
		We didn't find the page you're looking for.
	</span>
	<div class="allcenter py-6 space-x-6">
		<a href="/" id="swapbutton" class="py-1.5 px-7 font-semibold"> Back to Homepage </a>
	</div>
</div>


<style>
    #error {
        border: solid 2px #ed32bf;
        backdrop-filter: blur(25px);
    }
	#swapbutton {
		background: linear-gradient(276.31deg, #ed32bf -10.17%, #b5178e 97.19%);
		border-radius: 32px;
		backdrop-filter: blur(5.538px);
		border: 2.34px solid #b5178e;

		&:hover {
			border: 2.34px solid rgba(255, 255, 255, 0.326);
		}
	}
</style>
