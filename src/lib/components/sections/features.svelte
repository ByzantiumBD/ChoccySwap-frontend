<script lang="ts">
	import Mediaquery from '../atomic/mediaquery.svelte';
    import feats from "$lib/data/features"
	import Fadingcomponent from '../atomic/fadingcomponent.svelte';
</script>    
    
<Mediaquery query="(min-width:700px)" let:matches>
    <div class="flx mt-[8rem] w-full">
        <div class="flx rounded-xl box p-4">
        <div class="grid mx-2"
            style="grid-template-columns:repeat({matches? "2" : "1"}, minmax(0, 1fr));">
            {#each feats as feat, i}
                <Fadingcomponent class="w-[350px] h-full flx p-7 !justify-start" fadedStyle="opacity:0;transform:translateY({
                        (!matches)||i%2? "100px" : "50px"
                    })">
                    <img style:height={feat.size} class="mr-2" src={feat.url} alt="" />
                    <div class="flex flex-col align-center">
                        <p class="italic text-gray-0 text-[15pt]">
                            {feat.text}
                        </p>
                        <p class="italic text-gray-200 text-[10pt]">
                            {feat.explainer}
                        </p>
                    </div>
                </Fadingcomponent>
            {/each}
        </div>
    </div>
    </div>
</Mediaquery>

<style>
    .box {
        background-color: var(--gray);
        background-image: linear-gradient(
			135deg,
			rgb(34 34 34 / 0%),
			rgb(9 25 35 / 60%)
		), linear-gradient(
			225deg,
			rgb(34 34 34 / 0%),
			#ff9ced55
		);
    }
</style>