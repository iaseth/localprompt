
<script lang="ts">
	import { addPrompt, getEmptyPrompt, Checkboxes, type Prompt, type PromptBooleanKey, getPrompt } from "$lib";
	import ToggleField from "../components/ToggleField.svelte";
	import Debug from "./Debug.svelte";

	interface Props {
		uuid?: string,
		closeEditor: (updated?: boolean) => void
	}
	const { uuid, closeEditor }: Props = $props();

	let prompt: Prompt = $state(getEmptyPrompt());
	let promptExists = $derived(prompt.createdAt != 0);
	if (uuid) {
		getPrompt(uuid).then(promptFound => {
			if (promptFound) {
				prompt = promptFound;
			}
		})
	}

	function printObject () {
		console.log({...prompt});
	}

	function onclick () {
		if (promptExists) {
			console.log(`Updating prompt: '${prompt.uuid}'`);
		} else {
			console.log(`Adding prompt to db: '${prompt.uuid}'`);
		}

		addPrompt(prompt).then(() => {
			closeEditor(true);
		});
	}

	const onCancel = () => closeEditor(false);
</script>

<section class="prose prose-lg mx-auto bg-base-200 px-3 sm:px-6 pt-2 pb-8 rounded-md shadow">
	<header class="pb-4">
		<h4 class="text-center">Add Prompt</h4>
	</header>

	<section class="space-y-6">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Give it a Title</legend>
			<input type="text" class="input w-full" placeholder="Type here" bind:value={prompt.title} />
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Add the Prompt</legend>
			<textarea class="textarea h-48 w-full" placeholder="Prompt" bind:value={prompt.prompt}></textarea>
		</fieldset>

		<fieldset class="fieldset grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-base-100 border border-base-300 rounded-box">
			<legend class="fieldset-legend">Toggles</legend>

			{#each Checkboxes as { label, prop } }
				<ToggleField label={label} value={prompt[prop]} onchange={() => prompt[prop] = !prompt[prop]} />
			{/each}

		</fieldset>

		<footer class="flex gap-3">
			<button {onclick} class="btn btn-primary">{promptExists ? 'Update' : 'Add'}</button>
			<button onclick={onCancel} class="btn">Cancel</button>

			<Debug>
				<button onclick={printObject} class="btn">Print</button>
			</Debug>
		</footer>
	</section>
</section>
