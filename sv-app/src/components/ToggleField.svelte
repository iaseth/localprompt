
<script lang="ts">
	interface Props {
		label: string,
		value: boolean,
		onchange: () => void
	}
	let { label, value, onchange }: Props = $props()
</script>

<label class="fieldset-label">
	<input type="checkbox" checked={value} {onchange} class="checkbox" />
	<span>{label}</span>
</label>
