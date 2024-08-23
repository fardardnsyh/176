import { AccountClient } from '$lib/clients/AccountClient.js';
import { ExpenseClient } from '$lib/clients/ExpenseClient';
import type { Account } from '$lib/models/Account.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (session == null) {
		redirect(303, '/');
	}

	const tagName = event.params.name;

	const accountClient = new AccountClient(session.user.id);
	const expenseClient = new ExpenseClient(session.user.id);

	let expenses = await expenseClient.listAll({ tag: tagName });
	let accounts: Account[] = [];

	if (expenses.length > 0) {
		const accountIds = new Set(expenses.map((e) => e.accountId));

		expenses = await expenseClient.addPaymentDatesTo(expenses);
		accounts = await accountClient.listAll({ ids: Array.from(accountIds) });
	}

	return {
		session: session,
		expenses: expenses.map((e) => e.serialize()),
		accounts: accounts.map((a) => a.serialize())
	};
}
