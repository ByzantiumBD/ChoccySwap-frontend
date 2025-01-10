<script lang="ts">
	import unknown from '$lib/images/swap/unknown.svg';
	import type { EventHandler } from 'svelte/elements';

	interface Props {
		class?: string;
		style?: string;
		src: string;
		alt?: string;
	}

	let { class: imgClass, style, src, alt="logo" }: Props = $props();

	const onerror: EventHandler<Event, Element> = (e) => {
		(e.currentTarget as HTMLImageElement).onerror = null;
		(e.currentTarget as HTMLImageElement).src = unknown;
	};
</script>

<img class={imgClass} {style} {src} {alt} {onerror} />
