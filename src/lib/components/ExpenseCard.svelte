<script lang="ts">
	import type { Account } from '$lib/models/Account';
	import type { Expense } from '$lib/models/Expense';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { AccountBalanceUtil } from '$lib/util/AccountBalanceUtil';
	import { DateUtil } from '$lib/util/DateUtil';
	import { _ } from 'svelte-i18n';

	export let expense: Expense;
	export let account: Account;

	const accountBalanceUtil = new AccountBalanceUtil();
	const nextPaymentDate = accountBalanceUtil.getNextPaymentDateForExpense(expense);
	const monthlyAmount = expense.monthlyAmount;

	function getAmount(expense: Expense) {
		const amount = expense.isShared ? expense.amount / 2 : expense.amount;
		return AmountUtil.localizeDecimal(amount);
	}

	function localizePaymentFrequency(expense: Expense) {
		const numberOfPaymentDates = expense.paymentDates.length;

		switch (numberOfPaymentDates) {
			case 1:
				return $_('paid.yearly');
			case 2:
				return $_('paid.halfYearly');
			case 4:
				return $_('paid.quarterly');
			case 12:
			case 0:
				return $_('paid.monthly');
			default:
				return $_('paid.custom', { values: { times: numberOfPaymentDates } });
		}
	}
</script>

<a
	class="card grid grid-cols-2 space-y-2 bg-white p-4 {expense.isEnabled ? '' : 'opacity-60'}"
	href="/accounts/{account.id}/{expense.id}"
>
	<div>
		<h2 class="text-xl">{expense.name}</h2>
		<small class="text-slate-500">{expense.tag}</small>
	</div>
	<div class="text-right text-slate-500">
		{#if !expense.isEnabled}
			{$_('expense.inactive')}
		{:else if nextPaymentDate != null}
			{$_('nextPayment')}: {DateUtil.localizeLongerFormat(nextPaymentDate)}
		{/if}
	</div>
	<div>
		<h1 class="inline-block text-2xl">{getAmount(expense)}</h1>
		{#if expense.isMonthlyExpense}
			<small class="text-slate-500">/{$_('month')}</small>
		{:else}
			<small class="text-slate-500"
				>{AmountUtil.localizeDecimal(monthlyAmount)}/{$_('month')}
			</small>
		{/if}
	</div>
	<div class="text-right text-slate-500">{localizePaymentFrequency(expense)}</div>
</a>
