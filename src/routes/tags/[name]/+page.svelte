<script lang="ts">
	import { Expense } from '$lib/models/Expense';
	import { Account } from '$lib/models/Account';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import AmountCard from '$lib/components/AmountCard.svelte';

	export let data;
	const accounts: Account[] = data.accounts.map((a) => Account.parse(a));
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));

	function getAccount(expense: Expense) {
		return accounts.find((a) => a.id == expense.accountId)!;
	}

	let totalMonthlyAmount = 0;
	for (const expense of expenses) {
		if (!expense.isEnabled) {
			continue;
		}
		totalMonthlyAmount += expense.monthlyAmount;
	}
</script>

<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
	{#each expenses as expense (expense.id)}
		<ExpenseCard {expense} account={getAccount(expense)} />
	{/each}

	<div class="card mt-2 bg-white p-4 xl:col-span-2">
		<AmountCard text="total" amount={totalMonthlyAmount} />
	</div>
</div>
