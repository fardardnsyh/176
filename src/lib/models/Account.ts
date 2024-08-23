import type { AccountRecord } from '$lib/tables/AccountsTable';
import { Expense } from './Expense';

export class Account {
	private record: AccountRecord;
	private _expenses: Expense[];

	constructor(record: AccountRecord, expenses: Expense[]) {
		this.record = record;
		this._expenses = expenses;
	}

	public get id() {
		return this.record.id;
	}

	public get name() {
		return this.record.name;
	}

	public get userIds() {
		return this.record.userId;
	}

	public get expenses() {
		return this._expenses;
	}

	public set expenses(expenses: Expense[]) {
		this._expenses = expenses;
	}

	public get monthlyAmount(): number {
		let amount = 0;

		this.expenses.forEach((expense) => {
			if (!expense.isEnabled) {
				return;
			}
			amount += expense.monthlyAmount;
		});

		return amount;
	}

	public serialize() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			userIds: this.userIds,
			expenses: this.expenses.map((expense) => expense.serialize())
		});
	}

	public static parse(json: string): Account {
		const parsed = JSON.parse(json);

		return new Account(
			{
				id: parsed.id,
				name: parsed.name,
				userId: parsed.userIds
			},
			parsed.expenses.map((expense: string) => Expense.parse(expense))
		);
	}
}
