<script lang="ts">
	import Icon from '$lib/icons/Icon.svelte';

	export let cssClass: string;
</script>

<Icon {cssClass}>
	<path slot="path" stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</Icon>
