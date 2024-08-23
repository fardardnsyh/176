import { Month } from '$lib/enums/Month';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { describe, expect, test } from 'vitest';

describe('Tests for the Account model', () => {
	describe('Test for monthlyAmount', () => {
		test('Various expenses', () => {
			const account = new Account({ id: 1, name: 'Test', userId: ['user1'] }, [
				createExpense(100, []),
				createExpense(1200, [Month.MARCH]),
				createExpense(600, [Month.JANUARY, Month.JULY])
			]);

			expect(account.monthlyAmount).toBe(300);
		});

		test('Disabled expenses are not included', () => {
			const account = new Account({ id: 1, name: 'Test', userId: ['user1'] }, [
				createExpense(100, [], false)
			]);

			expect(account.monthlyAmount).toBe(0);
		});
	});

	test('Test for serialize and parse', () => {
		const account = new Account({ id: 1, name: 'Test', userId: ['user1'] }, [
			createExpense(600, [Month.JANUARY, Month.JULY])
		]);

		const serialized = account.serialize();
		const parsed = Account.parse(serialized);

		expect(parsed.expenses).toBeInstanceOf(Array);
		expect(parsed.expenses.length).toBe(1);
		const expense = parsed.expenses[0];
		expect(expense).toBeInstanceOf(Expense);
		expect(expense.amount).toBe(600);
		expect(expense.paymentDates.length).toBe(2);

		expect(parsed.id).toBe(1);
		expect(parsed.name).toBe('Test');
		expect(parsed.userIds.length).toBe(1);

		expect(parsed.userIds).toBeInstanceOf(Array);
		expect(parsed.userIds.length).toBe(1);
		const userId = parsed.userIds[0];
		expect(userId).toBe('user1');
	});
});

function createExpense(amount: number, months: Month[], isEnabled: boolean = true) {
	const expense = new Expense(
		{
			id: 0,
			name: 'Test',
			amount: amount,
			tag: 'tag',
			accountId: 0,
			isEnabled: isEnabled,
			isShared: false,
			userId: ['user1']
		},
		[]
	);

	for (let i = 0; i < months.length; i++) {
		expense.addPaymentDate(
			new PaymentDate({
				id: 0,
				expenseId: expense.id,
				month: months[i],
				userId: ['user1']
			})
		);
	}

	return expense;
}
