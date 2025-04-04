
<script lang="ts">
	import PromptEditor from "../components/PromptEditor.svelte";

	let uuid = $state('');
	let showEditor = $state(false);
	const toggleEditor = () => showEditor = !showEditor;
</script>

<svelte:head>
	<title>LocalPrompt</title>
</svelte:head>

<section class="min-h-screen max-w-3xl mx-auto py-12 px-4">
	<button class="btn btn-primary" onclick={toggleEditor}>Add</button>

	{#if showEditor}
		<section class="fixed top-0 left-0 w-full h-full overflow-y-scroll bg-zinc-900/75">
			<section class="md:px-6 md:py-16 w-full">
				<PromptEditor {uuid} onclose={toggleEditor} />
			</section>
		</section>
	{/if}
</section>
