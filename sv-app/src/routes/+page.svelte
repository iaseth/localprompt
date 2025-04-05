
<script lang="ts">
	import { getPromptsInRange, getCurrentTimestamp, type Prompt, getLastSundayTimestamp, deletePromptFromDB, createEmptyPrompt, addPromptToDB } from "$lib";
	import PromptCard from "../components/PromptCard.svelte";
	import PromptEditor from "../components/PromptEditor.svelte";

	let uuid = $state('');
	let showEditor = $state(false);
	const openEditor = () => showEditor = true;
	const closeEditor = (updated?: boolean) => {
		showEditor = false;
		if (updated) {
			loadPrompts();
		}
	};
	const addPrompt = () => {
		uuid = '';
		openEditor();
	};
	const editPrompt = (uuidX: string) => {
		uuid = uuidX;
		openEditor();
	};
	const ondelete = (uuidX: string) => {
		deletePromptFromDB(uuidX).then(() => loadPrompts());
	};

	let prompts: Prompt[] = $state([]);
	const toTimestamp = getCurrentTimestamp();
	const fromSundayTimestamp = getLastSundayTimestamp();

	function loadPrompts () {
		const to = getCurrentTimestamp();
		getPromptsInRange(fromSundayTimestamp, to).then(matchingPrompts => {
			prompts = matchingPrompts.sort((a, b) => b.updatedAt - a.updatedAt);
		});
	}

	interface ExamplePrompt {
		title: string,
		prompt: string,
		timestamp: number,
		isForText?: boolean,
		isForCode?: boolean,
		isForImage?: boolean,
		isForVideo?: boolean,
		isForAudio?: boolean
	}
	function populateExamplePrompts () {
		fetch('data/json/example-prompts.json')
			.then(res => res.json())
			.then(async (examplePrompts: ExamplePrompt[]) => {
			for (const examplePrompt of examplePrompts) {
				let newPrompt = createEmptyPrompt();
				newPrompt.title = examplePrompt.title;
				newPrompt.prompt = examplePrompt.prompt;

				newPrompt.createdAt = examplePrompt.timestamp;
				newPrompt.updatedAt = examplePrompt.timestamp;

				newPrompt.isForText = examplePrompt.isForText || false;
				newPrompt.isForCode = examplePrompt.isForCode || false;
				newPrompt.isForImage = examplePrompt.isForImage || false;
				newPrompt.isForVideo = examplePrompt.isForVideo || false;
				newPrompt.isForAudio = examplePrompt.isForAudio || false;

				addPromptToDB(newPrompt);
			}
		});
	}
</script>

<svelte:head>
	<title>LocalPrompt</title>
</svelte:head>

<section class="h-screen w-full overflow-hidden flex">
	<aside class="w-64 h-full overflow-y-auto bg-base-200 px-3 py-6">
		<header class="prose text-center py-4">
			<h4>LocalPrompt</h4>
			<p>Never lose a prompt again!</p>
		</header>

		<section class="flex flex-wrap gap-3 py-6">
			<button class="btn btn-primary" onclick={addPrompt}>Add</button>
			<button class="btn btn-secondary" onclick={loadPrompts}>Load</button>
			<button class="btn btn-secondary" onclick={populateExamplePrompts}>Populate</button>
		</section>
	</aside>

	<main class="flex-1 h-full overflow-y-auto">
		<section class="grow min-h-screen max-w-5xl mx-auto py-16 pb-32 px-4">
			<section class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 py-6 masonry">
				{#each prompts as prompt (prompt.uuid) }
					<PromptCard {prompt} onedit={() => editPrompt(prompt.uuid)}
						ondelete={() => ondelete(prompt.uuid)} />
				{/each}
			</section>
		</section>
	</main>
</section>

{#if showEditor}
	<section class="fixed z-50 top-0 left-0 w-full h-full overflow-y-scroll bg-zinc-900/75">
		<section class="md:px-6 md:py-16 w-full">
			<PromptEditor {uuid} {closeEditor} />
		</section>
	</section>
{/if}
