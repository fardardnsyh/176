<script lang="ts">
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';

	export let name: string;
	export let label: string;
	export let value: string | null | undefined;
	export let required = false;
	export let options: AutocompleteOption[];
	export let disabled = false;
</script>

<label class="label">
	<span>{label}</span>
	<input
		class="autocomplete input bg-secondary-50"
		type="search"
		{name}
		bind:value
		{required}
		{disabled}
		autocomplete="off"
		use:popup={{
			event: 'focus-click',
			target: 'popupAutocomplete',
			placement: 'bottom'
		}}
	/>
</label>

<div
	data-popup="popupAutocomplete"
	class="card max-h-48 w-full max-w-sm overflow-y-auto p-2 py-3"
	tabindex="-1"
>
	<Autocomplete
		bind:input={value}
		{options}
		on:selection={(e) => {
			value = e.detail.label;
		}}
	/>
</div>
