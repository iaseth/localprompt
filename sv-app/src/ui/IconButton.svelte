
<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		tooltip: string,
		onclick: () => void,
		children: Snippet
	}
	const { tooltip, onclick, children }: Props = $props();
</script>

<div class="tooltip" data-tip={tooltip}>
	<button {onclick} class="btn bg-base-100">
		{@render children()}
	</button>
</div>
