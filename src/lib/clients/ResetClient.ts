import { DatabaseClient } from './DatabaseClient';
import { ExpenseClient } from './ExpenseClient';

/**
 * Client used by e2e tests to reset the demo user.
 */
export class ResetClient extends DatabaseClient {
	async reset() {
		const db = this.getDatabase();

		const expenseClient = new ExpenseClient('1');
		const expenses = await expenseClient.listAll();
		const expenseIds = expenses.map((expense) => expense.id);

		if (expenseIds.length > 0) {
			await db.deleteFrom('paymentDates').where('expenseId', 'in', expenseIds).execute();
		}

		await db
			.deleteFrom('expenses')
			.where((eb) => eb(eb.val('1'), '=', eb.fn.any('userId')))
			.execute();

		await db
			.deleteFrom('accounts')
			.where((eb) => eb(eb.val('1'), '=', eb.fn.any('userId')))
			.execute();
	}
}
