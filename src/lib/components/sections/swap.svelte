<script lang="ts">
	import CTA from '../atomic/cta.svelte';
	import Fadingcomponent from '../atomic/fadingcomponent.svelte';
	import Mediaquery from '../atomic/mediaquery.svelte';

    function buy() {
        navigator.clipboard.writeText("0xb723783e0f9015c8E20b87F6CF7ae24dF6479e62");
        window.open("https://traderjoexyz.com/avalanche/trade", '_blank');
    }
</script>    
    
<Mediaquery query="(min-width:435px)" let:matches>
    <div class="flx {matches? "space-x-20" : "space-x-4"}">
        <Fadingcomponent fadedStyle="opacity:0;transform:translate(-100px,20px)">
            <div class="flx flex-col">
                <p class="text-gray-0 text-[20pt] pb-[0.5rem]">
                    Try it
                </p>
                <CTA text="Check out the app!" class="py-2" href="/exchange"/>
            </div>
        </Fadingcomponent>
        <Fadingcomponent fadedStyle="opacity:0;transform:translate(100px,20px)">
            <div class="flx flex-col">
                <p class="text-gray-0 text-[20pt] pb-[0.5rem]">
                    Buy it
                </p>
                <CTA text="Buy on TraderJoe!" isA={false} class="py-2"
                    action={buy} tooltip="Copy the token address and go to TraderJoe"/>
            </div>
        </Fadingcomponent>
    </div>
</Mediaquery>
