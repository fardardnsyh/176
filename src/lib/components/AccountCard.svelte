<script lang="ts">
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';
	import type { Account } from '$lib/models/Account';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { _ } from 'svelte-i18n';

	export let account: Account;
</script>

<a
	class="group card rounded-md bg-white p-10"
	href="/accounts/{account.id}"
	aria-label="Open the account {account.name}"
>
	<div class="flex">
		<h2 class="grow text-2xl">{account.name}</h2>

		<IconArrowCircleRight
			cssClass="ml-2 flex-none h-8 w-8 text-slate-300 group-hover:text-slate-400"
		/>
	</div>

	<div class="flex flex-wrap">
		<p class="text-4xl font-bold">{AmountUtil.localizeInteger(account.monthlyAmount)}</p>
		<p class="mt-auto text-slate-500">/{$_('month')}</p>
	</div>
</a>
