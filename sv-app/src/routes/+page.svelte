
<script lang="ts">
	import { getPromptsInRange, getCurrentTimestamp, type Prompt, getLastSundayTimestamp } from "$lib";
	import PromptCard from "../components/PromptCard.svelte";
	import PromptEditor from "../components/PromptEditor.svelte";

	let uuid = $state('');
	let showEditor = $state(false);
	const toggleEditor = () => showEditor = !showEditor;
	const editPrompt = (uuidX: string) => {
		uuid = uuidX;
		showEditor = true;
	};

	let prompts: Prompt[] = $state([]);
	const nowTimestamp = getCurrentTimestamp();
	const lastSundayTimestamp = getLastSundayTimestamp();

	function loadPrompts () {
		getPromptsInRange(lastSundayTimestamp, nowTimestamp).then(matchingPrompts => {
			prompts = matchingPrompts;
		});
	}
</script>

<svelte:head>
	<title>LocalPrompt</title>
</svelte:head>

<section class="min-h-screen max-w-5xl mx-auto py-12 px-4">
	<button class="btn btn-primary" onclick={toggleEditor}>Add</button>
	<button class="btn btn-primary" onclick={loadPrompts}>Load</button>

	<section class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 py-6">
		{#each prompts as prompt (prompt.uuid) }
			<PromptCard {prompt} onedit={() => editPrompt(prompt.uuid)} />
		{/each}
	</section>

	{#if showEditor}
		<section class="fixed z-50 top-0 left-0 w-full h-full overflow-y-scroll bg-zinc-900/75">
			<section class="md:px-6 md:py-16 w-full">
				<PromptEditor {uuid} onclose={toggleEditor} />
			</section>
		</section>
	{/if}
</section>
