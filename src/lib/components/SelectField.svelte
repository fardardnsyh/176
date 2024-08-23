<script lang="ts" generics="T extends Object">
	import type { SelectOption } from './types/SelectOption';

	export let name: string;
	export let label: string;
	export let required: boolean | undefined = undefined;
	export let disabled = false;

	// Eslint undefined type warning, has been disabled as it does not recognize the svelte syntax "generics="T"
	export let value: T | undefined = undefined; // eslint-disable-line no-undef
	export let options: SelectOption<T>[]; // eslint-disable-line no-undef
</script>

<label class="label">
	<span>{label}</span>

	<select {name} {disabled} {value} {required} class="input bg-secondary-50" size="1">
		{#each options as option (option.value)}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</label>
