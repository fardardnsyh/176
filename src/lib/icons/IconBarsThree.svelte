<script lang="ts">
	import Icon from '$lib/icons/Icon.svelte';

	export let cssClass: string;
</script>

<Icon {cssClass}>
	<path
		slot="path"
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
	/>
</Icon>
