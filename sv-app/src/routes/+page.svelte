
<script lang="ts">
	import { addPrompt, getEmptyPrompt, type Prompt } from "$lib";

	let prompt: Prompt = $state(getEmptyPrompt());

	function onclick () {
		console.log(`Adding prompt ${prompt.uuid} to db.`);
		addPrompt(prompt).then(() => {
			prompt = getEmptyPrompt();
		});
	}
</script>

<section class="min-h-screen py-12 px-4">
	<section class="max-w-3xl m-auto border-2 border-zinc-700 px-4 py-6 space-y-6">
		<h4 class="text-center">Welcome to Localprompt</h4>

		<input class="block w-full bg-zinc-950" type="text" bind:value={prompt.title} />
		<textarea class="block w-full bg-zinc-950" rows=10 bind:value={prompt.prompt}></textarea>
		<button {onclick}>Submit</button>
	</section>
</section>
