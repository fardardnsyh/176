import { AccountClient } from '$lib/clients/AccountClient.js';
import { ExpenseClient } from '$lib/clients/ExpenseClient.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (session == null) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);
	const expenseClient = new ExpenseClient(session.user.id);

	const id = +event.params.accountId;

	if (isNaN(id)) {
		redirect(303, '/accounts');
	}

	const account = await accountClient.getById(id);

	if (account == null) {
		redirect(303, '/accounts');
	}

	let expenses = await expenseClient.listAll({ accountId: account.id });

	if (expenses.length > 0) {
		expenses = await expenseClient.addPaymentDatesTo(expenses);
	}

	return {
		session: session,
		account: account.serialize(),
		expenses: expenses.map((e) => e.serialize())
	};
}
