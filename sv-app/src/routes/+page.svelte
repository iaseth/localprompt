
<script lang="ts">
	import { addPrompt, getEmptyPrompt, type Prompt, type PromptBooleanKey } from "$lib";
	import ToggleField from "../components/ToggleField.svelte";

	let prompt: Prompt = $state(getEmptyPrompt());

	const Checkboxes: { label: string, prop: PromptBooleanKey }[] = [
		{ label: 'Hidden', prop: 'isHidden' },
		{ label: 'Favorite', prop: 'isFavorite' },
		{ label: 'NSFW', prop: 'isNsfw' },
	];

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

<section class="min-h-screen py-12 px-4">
	<section class="max-w-3xl m-auto bg-zinc-950 px-4 py-6 rounded-md shadow">
		<header class="py-4">
			<h4 class="text-center">Add Prompt</h4>
		</header>

		<section class="space-y-6">
			<input class="input block w-full" type="text" bind:value={prompt.title} />
			<textarea class="textarea block w-full" rows=10 bind:value={prompt.prompt}></textarea>

			<fieldset class="fieldset grid sm:grid-cols-2 md:grid-cols-3 p-4 bg-base-100 border border-base-300 rounded-box">
				<legend class="fieldset-legend">Toggles</legend>

				{#each Checkboxes as { label, prop } }
					<ToggleField label={label} value={prompt[prop]} onchange={() => prompt[prop] = !prompt[prop]} />
				{/each}

			</fieldset>

			<footer class="flex gap-3">
				<button {onclick} class="btn btn-primary">Add</button>
				<button onclick={printObject} class="btn">Print</button>
			</footer>
		</section>
	</section>
</section>
