<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { Settings } from '$lib/models/Settings.js';
	import AmountCard from '$lib/components/AmountCard.svelte';
	import AccountCard from '$lib/components/AccountCard.svelte';

	export let data;
	const accounts = data.accounts.map((account) => Account.parse(account));
	const settings = Settings.parse(data.settings);

	let totalMonthlyAmount = 0;
	accounts.map((account) => (totalMonthlyAmount += account.monthlyAmount));
	let remainder = settings.income - totalMonthlyAmount;
</script>

{#if accounts.length === 0}
	<AddButton href="/accounts/0/edit" ariaLabel="New account" />
	<NoEntries question="chat.noAccounts" />
{:else}
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
		{#each accounts as account (account.id)}
			<AccountCard {account} />
		{/each}

		<AddButton href="/accounts/0/edit" ariaLabel="New account" />
	</div>

	<div class="card mt-9 grid grid-cols-1 gap-3 bg-white p-10 md:grid-cols-2 md:p-0 xl:grid-cols-3">
		<AmountCard text="total" amount={totalMonthlyAmount} />
		<div class="hidden xl:block"></div>
		<AmountCard text="remainderAfterExpenses" amount={remainder} />
	</div>
{/if}
