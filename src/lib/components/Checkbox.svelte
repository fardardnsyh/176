<script lang="ts">
	export let label: string;
	export let name: string;
	export let value: boolean;
	export let disabled: boolean = false;
</script>

<label class="flex items-center space-x-2">
	<input class="checkbox" type="checkbox" {name} bind:checked={value} {disabled} />
	<p>{label}</p>
</label>
