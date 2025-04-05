
<script lang="ts">
	import { copyToClipboard, timeAgo, type Prompt } from "$lib";
	import CopyIcon from "../icons/CopyIcon.svelte";
	import DeleteIcon from "../icons/DeleteIcon.svelte";
	import EditIcon from "../icons/EditIcon.svelte";
	import IconButton from "../ui/IconButton.svelte";

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
			<IconButton tooltip="Copy" onclick={() => copyToClipboard(prompt.prompt)}>
				<CopyIcon />
			</IconButton>
			<IconButton tooltip="Edit" onclick={onedit}>
				<EditIcon />
			</IconButton>
			<IconButton tooltip="Delete" onclick={() => copyToClipboard(prompt.prompt)}>
				<DeleteIcon />
			</IconButton>
		</footer>
	</section>
</article>
