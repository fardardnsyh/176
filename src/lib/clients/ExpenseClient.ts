import { DatabaseClient } from '$lib/clients/DatabaseClient';
import { Expense } from '$lib/models/Expense';
import { QueryResult } from '$lib/models/QueryResult';
import type { InsertableExpenseRecord, UpdateableExpenseRecord } from '$lib/tables/ExpensesTable';
import { sql } from 'kysely';
import { PaymentDateClient } from './PaymentDateClient';

type SearchCriteria = { accountId?: number; isEnabled?: boolean; tag?: string };

/**
 * Client for querying expenses in the database.
 */
export class ExpenseClient extends DatabaseClient {
	/**
	 * Create a new expense.
	 *
	 * @param expense the expense to create
	 * @returns the newly created expense
	 */
	public async create(expense: InsertableExpenseRecord): Promise<Expense> {
		const record = await this.getDatabase()
			.insertInto('expenses')
			.values(expense)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Expense(record, []);
	}

	/**
	 * Update an expense.
	 *
	 * @param id of the expense
	 * @param expense the expense values to update
	 * @returns the updated expense
	 */
	public async update(id: number, expense: UpdateableExpenseRecord): Promise<Expense> {
		const record = await this.getDatabase()
			.updateTable('expenses')
			.set(expense)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Expense(record, []);
	}

	/**
	 * Delete the given expense.
	 *
	 * @param id id of the expense to delete
	 * @returns result of the delete operation
	 */
	public async delete(id: number) {
		const result = await this.getDatabase()
			.deleteFrom('expenses')
			.where('id', '=', id)
			.executeTakeFirst();

		if (result.numDeletedRows == BigInt(0)) {
			return QueryResult.asErrorResult('Unknown error'); // TODO: Better error handling?
		}

		return QueryResult.asEmptySuccessResult();
	}

	/**
	 * Get the expense with the given id.
	 *
	 * @param id id of the expense
	 * @returns the expense or null
	 */
	public async getById(id: number): Promise<Expense | null> {
		const record = await this.getDatabase()
			.selectFrom('expenses')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirstOrThrow();

		if (!record) {
			return null;
		}

		return new Expense(record, []);
	}

	/**
	 * List all of the current user's expenses.
	 *
	 * @param [criteria=null] search criteria
	 * @returns the current user's expenses
	 */
	public async listAll(criteria: SearchCriteria | null = null) {
		let query = this.getDatabase()
			.selectFrom('expenses')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.orderBy('tag')
			.orderBy('name');

		if (criteria?.accountId) {
			query = query.where('accountId', '=', criteria.accountId);
		}

		if (criteria?.isEnabled !== undefined) {
			query = query.where('isEnabled', '=', criteria.isEnabled);
		}

		if (criteria?.tag) {
			query = query.where('tag', '=', criteria.tag);
		}

		const records = await query.execute();

		return records.map((record) => new Expense(record, []));
	}

	public async search(query: string) {
		const records = await this.getDatabase()
			.selectFrom('expenses')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.where(sql`LOWER(name)`, 'like', `%${query.toLowerCase()}%`)
			.execute();

		return records.map((record) => new Expense(record, []));
	}

	public async searchTags(query: string) {
		const records = await this.getDatabase()
			.selectFrom('expenses')
			.select('tag')
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.where(sql`LOWER(tag)`, 'like', `%${query.toLowerCase()}%`)
			.groupBy('tag')
			.execute();

		const tags = records.map((record) => record.tag);
		return tags.filter((tag) => tag != null) as string[];
	}

	/**
	 * List all used tags.
	 *
	 * @returns a unique list of used tags
	 */
	public async listAllTags(): Promise<string[]> {
		const records = await this.getDatabase()
			.selectFrom('expenses')
			.select('tag')
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.groupBy('tag')
			.orderBy('tag')
			.execute();

		const tags = records.map((record) => record.tag);
		return tags.filter((tag) => tag != null) as string[];
	}

	/**
	 * Add payment dates to the given expenses.
	 *
	 * @param expenses the expenses to add the payment dates to
	 * @returns the expenses with their payment dates
	 */
	public async addPaymentDatesTo(expenses: Expense[]) {
		const paymentDateClient = new PaymentDateClient(this.getUserId());

		const paymentDates = await paymentDateClient.listAll({
			expenseIds: expenses.map((expense) => expense.id)
		});

		return expenses.map((expense) => {
			expense.paymentDates = paymentDates.filter(
				(paymentDate) => paymentDate.expenseId === expense.id
			);
			return expense;
		});
	}
}
