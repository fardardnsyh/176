<script lang="ts">
	import IconChatBubbleOvalLeftEllipsis from '$lib/icons/IconChatBubbleOvalLeftEllipsis.svelte';
	import { _ } from 'svelte-i18n';

	export let question: string;
</script>

<div class="space-y-6">
	<div class="dm:mr-60 relative mr-20 mt-5 md:ml-20">
		<p class="rounded-xl bg-slate-400 p-5 pl-10 text-white shadow-lg">
			{$_(question)}
		</p>
	</div>
	<div class="relative ml-20 mt-5 md:ml-60 md:mr-20">
		<IconChatBubbleOvalLeftEllipsis
			cssClass="absolute -left-3 -top-3 h-11 w-11 rounded-full bg-white p-2"
		/>
		<p class="rounded-xl bg-tertiary-500 p-5 pl-10 text-white shadow-lg">
			{$_('chat.howToAdd')}
		</p>
	</div>
</div>
