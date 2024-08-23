<script lang="ts">
	import Icon from './Icon.svelte';

	export let cssClass: string | undefined;
</script>

<Icon {cssClass}>
	<path
		slot="path"
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
	/>
</Icon>
