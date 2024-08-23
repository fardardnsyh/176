<script lang="ts">
	import IconPlus from '$lib/icons/IconPlus.svelte';

	export let href: string;
	export let ariaLabel: string;
</script>

<a
	class="card flex items-center justify-center rounded-md border-4 border-dashed bg-white p-10"
	{href}
	aria-label={ariaLabel}
>
	<IconPlus cssClass="h-14 w-14 text-slate-300" />
</a>
