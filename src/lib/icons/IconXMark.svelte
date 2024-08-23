<script lang="ts">
	import Icon from '$lib/icons/Icon.svelte';

	export let cssClass: string;
</script>

<Icon {cssClass}>
	<path slot="path" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</Icon>
