
<script lang="ts">
	import type { Prompt } from "$lib";

	interface Props {
		prompt: Prompt,
		onedit: () => void
	}

	const { prompt, onedit }: Props = $props();
</script>

<article class="card bg-base-200 shadow-sm">
	<section class="card-body">
		<h2 class="card-title">{prompt.title}</h2>
		<p>{prompt.prompt}</p>

		<footer class="card-actions justify-end">
			<button class="btn btn-primary" onclick={onedit}>Edit</button>
		</footer>
	</section>
</article>
