
<script lang="ts">
	import { addPrompt, getEmptyPrompt, Checkboxes, type Prompt, type PromptBooleanKey } from "$lib";
	import ToggleField from "../components/ToggleField.svelte";
	import Debug from "./Debug.svelte";

	interface Props {
		onclose: () => void
	}
	const { onclose }: Props = $props();

	let prompt: Prompt = $state(getEmptyPrompt());

	function printObject () {
		console.log({...prompt});
	}

	function onclick () {
		console.log(`Adding prompt ${prompt.uuid} to db.`);
		addPrompt(prompt).then(() => {
			prompt = getEmptyPrompt();
		});
	}
</script>

<section class="prose prose-xl mx-auto bg-zinc-950 px-3 sm:px-6 pt-2 pb-8 rounded-md shadow">
	<header class="pb-4">
		<h4 class="text-center">Add Prompt</h4>
	</header>

	<section class="space-y-6">
		<input class="input input-primary text-lg w-full" type="text" bind:value={prompt.title} />
		<textarea class="textarea textarea-primary block w-full" rows=10 bind:value={prompt.prompt}></textarea>

		<fieldset class="fieldset grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-base-100 border border-base-300 rounded-box">
			<legend class="fieldset-legend">Toggles</legend>

			{#each Checkboxes as { label, prop } }
				<ToggleField label={label} value={prompt[prop]} onchange={() => prompt[prop] = !prompt[prop]} />
			{/each}

		</fieldset>

		<footer class="flex gap-3">
			<button {onclick} class="btn btn-primary">Add</button>
			<button onclick={onclose} class="btn">Cancel</button>

			<Debug>
				<button onclick={printObject} class="btn">Print</button>
			</Debug>
		</footer>
	</section>
</section>
