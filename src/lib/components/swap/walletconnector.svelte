
<script lang="ts">
	import { shortenId } from "$lib/utils";
	import type { Session } from "@chromia/ft4";
	import { disconnectModal, modal, subscribeToModal } from "$lib/interactions/reown";
	import { onMount } from "svelte";
	import { getSession } from "$lib/interactions/connection";

    let { session = $bindable() }: { session: Session | undefined } = $props();

    function connect() {
        modal.open();
    }

    function updateUI() {
        session = getSession();
    }

    onMount(async ()=> {
        subscribeToModal(updateUI)
    })
</script>

{#if session}
    <button onclick={disconnectModal} class="pinkbutton py-1.5 px-7 font-semibold">
        Disconnect ({shortenId(session.account.id)})
    </button>
{:else}
    <button onclick={connect} class="pinkbutton py-1.5 px-7 font-semibold">
        Connect Wallet
    </button>
{/if}


<style lang="less">
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