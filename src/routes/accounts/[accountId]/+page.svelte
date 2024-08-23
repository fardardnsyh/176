<script lang="ts">
	import { Expense } from '$lib/models/Expense';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { Account } from '$lib/models/Account';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';

	export let data;
	const account = Account.parse(data.account);
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));
</script>

{#if expenses.length == 0}
	<AddButton href="/accounts/{account.id}/0" ariaLabel="Add new expense" />
	<NoEntries question="chat.noExpenses" />
{:else}
	<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
		{#each expenses as expense (expense.id)}
			<ExpenseCard {expense} {account} />
		{/each}
		<AddButton href="/accounts/{account.id}/0" ariaLabel="Add new expense" />
	</div>
{/if}
