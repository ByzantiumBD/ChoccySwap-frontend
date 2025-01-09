<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>


<div id="black" class="w-full bg-black h-auto grow flex">
    <span class="c ctopright"></span>
    <span class="c cextleft"></span>
    <span class="c cextmidleft"></span>
    <span class="c cextright"></span>
    <span class="c cextmidright"></span>
    <span class="c ctopleft"></span>
    <span class="c cmidleft"></span>
    <span class="c cmidright"></span>
    <span class="c cbottom"></span> 
    <div id="container" class="allcenter grow">
        <div class="max-w-[1200px] grow self-stretch z-[2] allcenter flex-col">
            {@render children?.()} 
        </div>
    </div>
</div>

<style lang="less">
    #container:before {
        background-image: url("$lib/images/common/bg.svg");
        background-size: 70cm;
        background-position: center;
        opacity: 30%;

        content: '';
        position: absolute;
        left: 0; top: 0;
        width: 100%; height: 100%;
        z-index: 1;
        mask-image:
            radial-gradient(ellipse 20cm 40cm at 50% 20cm, #0000 0%, #0000 10%, #000f 100%);
    }

    .c {
        position: absolute;
        height: 200px; width: 200px;
        border-radius: 100%;
        filter: blur(120px);
        
        &topright {
            height: max(20vh, 400px); width: 200px;
            transform: rotate(-45deg);

            background-image: linear-gradient(0deg, rgba(147, 238, 255, 0.6) 13%, rgba(255, 2, 209, 0.6) 85%);
            top: 0; right: calc(50% - 10cm);
        }
        
        &extleft {
            height: 200px; width: 400px;
            transform: rotate(45deg);

            background-color: rgba(147, 238, 255, 0.6);
            top: -8cm; left: calc(50% - 25cm);
        }
        
        &extmidleft {
            height: 200px; width: 400px;
            transform: rotate(-25deg);

            background-image: linear-gradient(90deg, rgba(147, 238, 255, 0.6) 13%, rgba(255, 2, 209, 0.6) 85%);
            top: 30%; left: calc(50% - 35cm);
        }
        
        &extright {
            height: 200px; width: 400px;
            transform: rotate(45deg);

            background-color: rgba(255, 2, 209, 0.5);
            top: -4cm; right: calc(50% - 28cm);
        }
        
        &extmidright {
            height: 200px; width: 400px;
            transform: rotate(160deg);

            background-image: linear-gradient(90deg, rgba(147, 238, 255, 0.6) 13%, rgba(255, 2, 209, 0.6) 85%);
            top: 40%; right: calc(50% - 35cm);
        }
        
        &topleft {
            height: 400px; width: 200px;
            transform: rotate(45deg);

            background-color: rgba(255, 2, 209, 0.5);
            top: 2cm; left: calc(50% - 10cm);
        }
        
        &midleft {
            background-color: rgba(147, 238, 255, 0.6);
            top: 50%; left: calc(50% - 15cm);
        }
        
        &midright {
            background-color: rgba(255, 2, 209, 0.6);
            top: calc(50% + 5cm); right: calc(50% - 15cm);
        }
        
        &bottom {
            height: 200px; width: 600px;
            background-image: linear-gradient(90deg, rgba(147, 238, 255, 0.6) 13%, rgba(255, 2, 209, 0.6) 85%);
            transform: rotate(30deg);

            bottom: 12cm; left: calc(50% - 5cm);
        }
    }
</style>