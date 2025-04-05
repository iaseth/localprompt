
<script lang="ts">
	const { children } = $props();
	let isDev = $state(false);

	$effect(() => {
		isDev = import.meta.env.DEV && window?.location.hostname === 'localhost';
	});
</script>

{#if isDev}
	{@render children()}
{/if}
