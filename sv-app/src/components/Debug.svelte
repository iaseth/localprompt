
<script lang="ts">
	const { children } = $props();
	const isDev = import.meta.env.DEV && window?.location.hostname === 'localhost';
</script>

{#if isDev}
	{@render children()}
{/if}
