<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import BalanceCard from '$lib/components/AccountBalanceCard.svelte';

	export let data;

	const accounts = data.accounts.map((account) => Account.parse(account));
</script>

<div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
	{#each accounts as account (account.id)}
		<BalanceCard {account} />
	{/each}
</div>
