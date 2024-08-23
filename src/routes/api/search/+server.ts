import { AccountClient } from '$lib/clients/AccountClient';
import { ExpenseClient } from '$lib/clients/ExpenseClient.js';
import { Account } from '$lib/models/Account';
import type { Expense } from '$lib/models/Expense';
import type SearchResult from '$lib/models/SearchResult';
import { RecordType } from '$lib/models/SearchResult';
import { json, redirect, type RequestEvent } from '@sveltejs/kit';

export const GET = async (request: RequestEvent) => {
	const session = await request.locals.auth();
	if (session == null) {
		redirect(303, '/');
	}

	const query = request.url.searchParams.get('q') ?? '';

	const accountClient = new AccountClient(session.user.id);
	const expenseClient = new ExpenseClient(session.user.id);

	// Query the records
	const [accounts, expenses, tags] = await Promise.all([
		accountClient.search(query),
		expenseClient.search(query),
		expenseClient.searchTags(query)
	]);

	// Convert them to SearchResult objects
	const accountResults: SearchResult[] = accounts.map((account) => accountToSearchResult(account));
	const expenseResults: SearchResult[] = expenses.map((expense) => expenseToSearchResult(expense));
	const tagResults: SearchResult[] = tags.map((tag) => tagToSearchResult(tag));

	// Gather the results
	const results: SearchResult[] = [];
	results.push(...accountResults);
	results.push(...expenseResults);
	results.push(...tagResults);

	results.sort((r1, r2) => r1.name.localeCompare(r2.name));

	return json(results);
};

function accountToSearchResult(account: Account): SearchResult {
	return { name: account.name, url: `/accounts/${account.id}`, recordType: RecordType.ACCOUNT };
}

function expenseToSearchResult(expense: Expense): SearchResult {
	return {
		name: expense.name,
		url: `/accounts/${expense.accountId}/${expense.id}`,
		recordType: RecordType.EXPENSE
	};
}

function tagToSearchResult(tag: string): SearchResult {
	return { name: tag, url: `/tags/${tag}`, recordType: RecordType.TAG };
}
