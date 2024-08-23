import { Month } from '$lib/enums/Month';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { describe, expect, test } from 'vitest';

describe('Tests for the Expense model', () => {
	test('Test for monthlyAmount', () => {
		/*
		 Monthly (Implicit)
		 */
		let expense = createExpense();
		expect(expense.monthlyAmount).toBe(1200);
		expense.isShared = true;
		expect(expense.monthlyAmount).toBe(600);

		/*
		 Monthly (explicit)
		 */
		expense = createMonthlyExpenseExplicit();
		expect(expense.monthlyAmount).toBe(1200);
		expense.isShared = true;
		expect(expense.monthlyAmount).toBe(600);

		/*
		 Yearly
		 */
		expense = createYearlyExpense();
		expect(expense.monthlyAmount).toBe(100);
		expense.isShared = true;
		expect(expense.monthlyAmount).toBe(50);

		/*
		 Half-yearly
		 */
		expense = createHalfYearlyExpense();
		expect(expense.monthlyAmount).toBe(200);
		expense.isShared = true;
		expect(expense.monthlyAmount).toBe(100);

		/*
		 Quarterly
		 */
		expense = createQuarterlyExpense();
		expect(expense.monthlyAmount).toBe(400);
		expense.isShared = true;
		expect(expense.monthlyAmount).toBe(200);
	});

	test('Test for monthlyAmountWithTotalShared', () => {
		/*
		Monthly (Implicit)
		*/
		let expense = createExpense();
		expect(expense.monthlyAmountWithTotalShared).toBe(1200);
		expense.isShared = true;
		expect(expense.monthlyAmountWithTotalShared).toBe(1200);

		/*
		Monthly (explicit)
		*/
		expense = createMonthlyExpenseExplicit();
		expect(expense.monthlyAmountWithTotalShared).toBe(1200);
		expense.isShared = true;
		expect(expense.monthlyAmountWithTotalShared).toBe(1200);

		/*
		Yearly
		*/
		expense = createYearlyExpense();
		expect(expense.monthlyAmountWithTotalShared).toBe(100);
		expense.isShared = true;
		expect(expense.monthlyAmountWithTotalShared).toBe(100);

		/*
		Half-yearly
		*/
		expense = createHalfYearlyExpense();
		expect(expense.monthlyAmountWithTotalShared).toBe(200);
		expense.isShared = true;
		expect(expense.monthlyAmountWithTotalShared).toBe(200);

		/*
		Quarterly
		*/
		expense = createQuarterlyExpense();
		expect(expense.monthlyAmountWithTotalShared).toBe(400);
		expense.isShared = true;
		expect(expense.monthlyAmountWithTotalShared).toBe(400);
	});

	test('Test for isMonthlyExpense', () => {
		let expense = createExpense();
		expect(expense.isMonthlyExpense).toBe(true);

		expense = createMonthlyExpenseExplicit();
		expect(expense.isMonthlyExpense).toBe(true);

		expense = createYearlyExpense();
		expect(expense.isMonthlyExpense).toBe(false);

		expense = createHalfYearlyExpense();
		expect(expense.isMonthlyExpense).toBe(false);

		expense = createQuarterlyExpense();
		expect(expense.isMonthlyExpense).toBe(false);
	});

	test('Test for serialize and parse', () => {
		const expense = createYearlyExpense();
		const serialized = expense.serialize();
		const parsed = Expense.parse(serialized);

		expect(parsed.paymentDates).toBeInstanceOf(Array);
		expect(parsed.paymentDates.length).toBe(1);
		const paymentDate = parsed.paymentDates[0];
		expect(paymentDate).toBeInstanceOf(PaymentDate);
		expect(paymentDate.expenseId).toBe(0);
		expect(paymentDate.id).toBe(0);
		expect(paymentDate.month).toBe(Month.JANUARY);
		expect(paymentDate.userIds).toBeInstanceOf(Array);
		let userId = paymentDate.userIds[0];
		expect(userId).toBe('user2');

		expect(parsed.accountId).toBe(1);
		expect(parsed.amount).toBe(1200);
		expect(parsed.id).toBe(2);
		expect(parsed.isEnabled).toBe(true);
		expect(parsed.isShared).toBe(false);
		expect(parsed.name).toBe('A name');
		expect(parsed.tag).toBe('A tag');

		expect(parsed.userIds).toBeInstanceOf(Array);
		expect(parsed.userIds.length).toBe(1);
		userId = parsed.userIds[0];
		expect(userId).toBe('user1');
	});
});

function createMonthlyExpenseExplicit() {
	const expense = createExpense();
	expense.paymentDates = [
		createPaymentDate(Month.JANUARY),
		createPaymentDate(Month.FEBRUARY),
		createPaymentDate(Month.MARCH),
		createPaymentDate(Month.APRIL),
		createPaymentDate(Month.MAY),
		createPaymentDate(Month.JUNE),
		createPaymentDate(Month.JULY),
		createPaymentDate(Month.AUGUST),
		createPaymentDate(Month.SEPTEMBER),
		createPaymentDate(Month.OCTOBER),
		createPaymentDate(Month.NOVEMBER),
		createPaymentDate(Month.DECEMBER)
	];
	return expense;
}

function createYearlyExpense() {
	const expense = createExpense();
	expense.paymentDates = [createPaymentDate(Month.JANUARY)];
	return expense;
}

function createHalfYearlyExpense() {
	const expense = createExpense();
	expense.paymentDates = [createPaymentDate(Month.JANUARY), createPaymentDate(Month.JULY)];
	return expense;
}

function createQuarterlyExpense() {
	const expense = createExpense();
	expense.paymentDates = [
		createPaymentDate(Month.JANUARY),
		createPaymentDate(Month.APRIL),
		createPaymentDate(Month.JULY),
		createPaymentDate(Month.OCTOBER)
	];
	return expense;
}
function createExpense() {
	return new Expense(
		{
			id: 2,
			name: 'A name',
			amount: 1200,
			tag: 'A tag',
			accountId: 1,
			isEnabled: true,
			isShared: false,
			userId: ['user1']
		},
		[]
	);
}

function createPaymentDate(month: Month) {
	return new PaymentDate({ id: 0, userId: ['user2'], expenseId: 0, month: month });
}
