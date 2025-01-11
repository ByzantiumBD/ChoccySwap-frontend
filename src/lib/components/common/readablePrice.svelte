<script>
    let {
        class: myClass = "",
        fontSize = 1,
        smallFontSize = undefined,
        val, numberOfDecimalZeros = 0
    } = $props()
</script>

<span class={myClass} style="position:relative;font-size:{fontSize}rem;">
    {#if numberOfDecimalZeros}
        <span style="margin-right:-{fontSize*0.2}rem;">0.0</span>
        <span style="position:relative;bottom:-0.3rem;font-size:{smallFontSize?? fontSize*0.6}rem;">
            {numberOfDecimalZeros}
        </span>
        <span style="margin-left:-{fontSize*0.2}rem;">{val}</span>
    {:else}
        <span >{val}</span>
    {/if}
</span>