
<script lang="ts">
	import { timeAgo, type Prompt } from "$lib";

	interface Props {
		prompt: Prompt,
		onedit: () => void
	}

	const { prompt, onedit }: Props = $props();
	const neverUpdated = prompt.createdAt === prompt.updatedAt;
</script>

<article class="card bg-base-200 shadow-sm">
	<section class="card-body">
		<h2 class="card-title">{prompt.title}</h2>
		<p>{prompt.prompt}</p>
		<h4>{neverUpdated ? 'Added' : 'Updated'} {timeAgo(prompt.updatedAt)}</h4>

		<footer class="card-actions justify-end">
			<button class="btn btn-primary" onclick={onedit}>Edit</button>
		</footer>
	</section>
</article>
