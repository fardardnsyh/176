import type { ExpenseRecord } from '$lib/tables/ExpensesTable';
import { PaymentDate } from './PaymentDate';

export class Expense {
	private record: ExpenseRecord;
	private _paymentDates: PaymentDate[];

	constructor(record: ExpenseRecord, paymentDates: PaymentDate[]) {
		this.record = record;
		this.record.amount = +this.record.amount;
		this._paymentDates = paymentDates;
	}

	public get id() {
		return this.record.id;
	}

	public get name() {
		return this.record.name;
	}

	public get amount() {
		return this.record.amount;
	}

	public get monthlyAmount() {
		return this.calculateMontlyAmount(true);
	}

	public get monthlyAmountWithTotalShared() {
		return this.calculateMontlyAmount(false);
	}

	private calculateMontlyAmount(divideShared: boolean) {
		const amount = divideShared && this.isShared ? this.amount / 2 : this.amount;
		if (this.isMonthlyExpense) {
			return amount;
		}

		const numberOfTransfers = 12 / this.paymentDates.length;
		return amount / numberOfTransfers;
	}

	public get isMonthlyExpense() {
		const numberOfDates = this.paymentDates.length;
		return numberOfDates === 0 || numberOfDates === 12;
	}

	public get tag() {
		return this.record.tag;
	}

	public get accountId() {
		return this.record.accountId;
	}

	public get isEnabled() {
		return this.record.isEnabled;
	}

	public get isShared() {
		return this.record.isShared;
	}

	public set isShared(value: boolean) {
		this.record.isShared = value;
	}

	public get paymentDates() {
		return this._paymentDates;
	}

	public set paymentDates(paymentDates: PaymentDate[]) {
		this._paymentDates = paymentDates;
	}

	public addPaymentDate(paymentDate: PaymentDate) {
		this._paymentDates.push(paymentDate);
	}

	public get userIds() {
		return this.record.userId;
	}

	public serialize() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			amount: this.amount,
			tag: this.tag,
			accountId: this.accountId,
			enabled: this.isEnabled,
			shared: this.isShared,
			paymentDates: this.paymentDates.map((paymentDate) => paymentDate.serialize()),
			userIds: this.userIds
		});
	}

	public static parse(json: string) {
		const parsed = JSON.parse(json);

		return new Expense(
			{
				id: parsed.id,
				name: parsed.name,
				amount: parsed.amount,
				tag: parsed.tag,
				accountId: parsed.accountId,
				isEnabled: parsed.enabled,
				isShared: parsed.shared,
				userId: parsed.userIds
			},
			parsed.paymentDates.map((paymentDate: string) => PaymentDate.parse(paymentDate))
		);
	}
}
