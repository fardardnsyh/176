<script lang="ts">
	import Icon from '$lib/icons/Icon.svelte';

	export let cssClass: string;
</script>

<Icon {cssClass}>
	<path
		slot="path"
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
	/>
</Icon>
