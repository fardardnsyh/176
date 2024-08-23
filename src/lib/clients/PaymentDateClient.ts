import { DatabaseClient } from '$lib/clients/DatabaseClient';
import { PaymentDate } from '$lib/models/PaymentDate';
import type { InsertablePaymentDateRecord } from '$lib/tables/PaymentDatesTable';

type SearchCriteria = { expenseIds?: number[]; expenseId?: number };

/**
 * Client for querying payment dates in the database.
 */
export class PaymentDateClient extends DatabaseClient {
	/**
	 * Create a new payment date.
	 *
	 * @param paymentDate the payment date to create
	 * @returns the newly created payment date
	 */
	public async create(paymentDate: InsertablePaymentDateRecord): Promise<PaymentDate> {
		const record = await this.getDatabase()
			.insertInto('paymentDates')
			.values(paymentDate)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new PaymentDate(record);
	}

	/**
	 * List all of the current user's payment dates.
	 *
	 * @param [criteria=null] search criteria
	 * @returns all payment dates for the given user
	 */
	public async listAll(criteria: SearchCriteria | null = null): Promise<PaymentDate[]> {
		let query = this.getDatabase()
			.selectFrom('paymentDates')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')));

		if (criteria?.expenseId) {
			query = query.where('expenseId', '=', criteria.expenseId);
		}

		if (criteria?.expenseIds) {
			query = query.where('expenseId', 'in', criteria.expenseIds);
		}

		const records = await query.execute();

		return records.map((record) => new PaymentDate(record));
	}

	/**
	 * Delete all payment dates belonging to the given expense.
	 *
	 * @param id the id of the expense to remove payment dates from
	 */
	public async deleteAllBelongingTo(id: number) {
		await this.getDatabase().deleteFrom('paymentDates').where('expenseId', '=', id).execute();
	}
}
