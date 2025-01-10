
<script lang="ts">
	import { shortenId } from "$lib/utils";
	import type { Session } from "@chromia/ft4";

    let session: Session | undefined = $state(undefined);

    function connect() {
        
    }
    function disconnect() {
        
    }
</script>

{#if session}
    <div class="pinkbutton py-1.5 px-7 font-semibold ml-8">
        {shortenId(session.account.id)}
    </div>
{:else}
    <button onclick={connect} class="pinkbutton py-1.5 px-7 font-semibold ml-8">
        Connect Wallet
    </button>
{/if}
{#if openModal}
{/if}


<style lang="less">
	div.pinkbutton:hover {
		border: 2.34px solid #b5178e !important;
	}

	.pinkbutton {
		background: linear-gradient(276.31deg, #ed32bf -10.17%, #b5178e 97.19%);
		border-radius: 32px;
		backdrop-filter: blur(5.538px);
		border: 2.34px solid #b5178e;

		&:hover {
			border: 2.34px solid rgba(255, 255, 255, 0.326);
		}
	}
</style>