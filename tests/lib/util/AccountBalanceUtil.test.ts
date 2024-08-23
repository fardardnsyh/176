import { Month } from '$lib/enums/Month';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { AccountBalanceUtil } from '$lib/util/AccountBalanceUtil';
import { beforeAll, describe, expect, test, vi } from 'vitest';

const userIds: string[] = [];

beforeAll(() => {
	// Tell vitest to use mocked time
	vi.useFakeTimers();
});

describe('Tests for getCurrentAmount', () => {
	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Test',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.FEBRUARY,
				userId: userIds
			})
		];

		account.expenses = [expense];

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const util = new AccountBalanceUtil();
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Expenses without payment dates are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		account.expenses = [
			new Expense(
				{
					id: 1,
					name: 'Test',
					amount: 100,
					tag: 'Test',
					accountId: account.id,
					isEnabled: true,
					isShared: false,
					userId: userIds
				},
				[]
			)
		];

		const util = new AccountBalanceUtil();
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Expense with a single payment date', () => {
		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const util = new AccountBalanceUtil();

		let account = createAccountWithSinglePaymentExpense(Month.FEBRUARY);
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		account = createAccountWithSinglePaymentExpense(Month.MARCH);
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1000);

		account = createAccountWithSinglePaymentExpense(Month.APRIL);
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);
	});

	test('Payment date is in the following year', () => {
		vi.setSystemTime(new Date(2023, Month.OCTOBER, 22));
		const util = new AccountBalanceUtil();

		const account = createAccountWithSinglePaymentExpense(Month.MAY);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);
	});

	test('Payment date is tomorrow', () => {
		vi.setSystemTime(new Date(2023, Month.OCTOBER, 31));
		const util = new AccountBalanceUtil();

		const account = createAccountWithSinglePaymentExpense(Month.NOVEMBER);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);
	});

	test('Payment date is in exactly one year', () => {
		vi.setSystemTime(new Date(2023, Month.OCTOBER, 1));
		const util = new AccountBalanceUtil();

		const account = createAccountWithSinglePaymentExpense(Month.OCTOBER);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Half-yearly expense', () => {
		const paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: 1,
				month: Month.JANUARY,
				userId: userIds
			}),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.JULY, userId: userIds })
		];

		const account = createAccountWithPaymentDates(600, paymentDates);
		const util = new AccountBalanceUtil();

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		vi.setSystemTime(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);

		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);

		vi.setSystemTime(new Date(2023, Month.JULY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		vi.setSystemTime(new Date(2023, Month.AUGUST, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);
	});

	test('Quarterly expense', () => {
		const paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: 1,
				month: Month.JANUARY,
				userId: userIds
			}),
			new PaymentDate({ id: 1, expenseId: 1, month: Month.APRIL, userId: userIds }),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.JULY, userId: userIds }),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.OCTOBER, userId: userIds })
		];

		const account = createAccountWithPaymentDates(500, paymentDates);
		const util = new AccountBalanceUtil();

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		vi.setSystemTime(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(167);

		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(334);
	});

	test('Multiple expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Test',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 600,
				tag: 'Test',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.OCTOBER,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 2,
				expenseId: expense2.id,
				month: Month.MARCH,
				userId: userIds
			}),
			new PaymentDate({
				id: 3,
				expenseId: expense2.id,
				month: Month.SEPTEMBER,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new AccountBalanceUtil();

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(700);

		vi.setSystemTime(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		vi.setSystemTime(new Date(2023, Month.MARCH, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);

		vi.setSystemTime(new Date(2023, Month.APRIL, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(700);

		vi.setSystemTime(new Date(2023, Month.MAY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		vi.setSystemTime(new Date(2023, Month.JULY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1300);

		vi.setSystemTime(new Date(2023, Month.AUGUST, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1500);

		vi.setSystemTime(new Date(2023, Month.SEPTEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		vi.setSystemTime(new Date(2023, Month.OCTOBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);

		vi.setSystemTime(new Date(2023, Month.NOVEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(300);

		vi.setSystemTime(new Date(2023, Month.DECEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);
	});

	test('Shared expenses and own expenses are handled the same way', () => {
		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const util = new AccountBalanceUtil();
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		/*
         Own expense
         */
		let expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.APRIL,
				userId: userIds
			})
		];

		account.expenses = [expense];

		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		/*
         Shared expense
         */
		expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: true,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.APRIL,
				userId: userIds
			})
		];

		account.expenses = [expense];

		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);
	});
});

describe('Tests for getNextPaymentDate', () => {
	test('An account with no expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDate(account);
		expect(paymentDate).toBe(null);
	});

	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.FEBRUARY,
				userId: userIds
			})
		];

		account.expenses = [expense];

		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDate(account);
		expect(paymentDate).toBe(null);
	});

	test('Monthly expense', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		account.expenses = [
			new Expense(
				{
					id: 1,
					name: 'Test',
					amount: 100,
					tag: 'Tag',
					accountId: account.id,
					isEnabled: true,
					isShared: false,
					userId: userIds
				},
				[]
			)
		];

		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses, only one is enabled', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.MARCH,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.FEBRUARY,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.MARCH);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.MARCH,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.FEBRUARY,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.FEBRUARY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses, one is next year', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.APRIL,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.JANUARY,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new AccountBalanceUtil();
		vi.setSystemTime(new Date(2023, Month.JANUARY, 1));
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.APRIL);
		expect(paymentDate.getDate()).toBe(1);
	});
});

describe('Tests for getNextPaymentDateForExpense', () => {
	test('Monthly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new AccountBalanceUtil();
		vi.setSystemTime(new Date(2023, Month.JUNE, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Monthly expense in december', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new AccountBalanceUtil();
		vi.setSystemTime(new Date(2023, Month.DECEMBER, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2024);
		expect(paymentDate.getMonth()).toBe(Month.JANUARY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Yearly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.MAY,
				userId: userIds
			})
		];

		const util = new AccountBalanceUtil();
		vi.setSystemTime(new Date(2023, Month.MARCH, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.MAY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Yearly expense, next year', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.MAY,
				userId: userIds
			})
		];

		const util = new AccountBalanceUtil();
		vi.setSystemTime(new Date(2023, Month.MAY, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2024);
		expect(paymentDate.getMonth()).toBe(Month.MAY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Half-yearly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[
				new PaymentDate({
					id: 1,
					expenseId: 1,
					month: Month.MAY,
					userId: userIds
				}),
				new PaymentDate({
					id: 2,
					expenseId: 1,
					month: Month.JULY,
					userId: userIds
				})
			]
		);

		vi.setSystemTime(new Date(2023, Month.MAY, 1));
		const util = new AccountBalanceUtil();
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});
});

describe('Test for getNextPaymentDateForExpenseAfter', () => {
	test('Monthly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new AccountBalanceUtil();
		const date = new Date(2023, Month.JUNE, 1);
		const paymentDate = util.getNextPaymentDateForExpenseAfter(expense, date);

		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});
});

describe('Test for getAccountBalanceOn', () => {
	test('Monthly expense', () => {
		const account = new Account({ id: 0, name: 'name', userId: userIds }, []);

		account.expenses = [
			createExpenseOn(100, []),
			createExpenseOn(1200, [Month.JANUARY]), //1100
			createExpenseOn(600, [Month.JANUARY, Month.JULY]), //500
			createExpenseOn(300, [Month.FEBRUARY, Month.MAY, Month.AUGUST, Month.NOVEMBER]) //100
		];

		const util = new AccountBalanceUtil();
		let amount = util.getAccountBalanceOn(account, new Date(2023, Month.JANUARY, 1));
		expect(amount).toBe(200);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.FEBRUARY, 1));
		expect(amount).toBe(200);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.MARCH, 1));
		expect(amount).toBe(500);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.APRIL, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.MAY, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.JUNE, 1));
		expect(amount).toBe(1100);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.JULY, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.AUGUST, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.SEPTEMBER, 1));
		expect(amount).toBe(1100);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.OCTOBER, 1));
		expect(amount).toBe(1400);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.NOVEMBER, 1));
		expect(amount).toBe(1400);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.DECEMBER, 1));
		expect(amount).toBe(1700);
	});
});

describe('Test for getExpensesIn', () => {
	test('Various months', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [
			createExpenseOn(1, []),
			createExpenseOn(2, [Month.JANUARY]),
			createExpenseOn(3, [Month.JANUARY, Month.JULY]),
			createExpenseOn(4, [Month.JULY])
		]);

		const util = new AccountBalanceUtil();
		let expenses = util.getExpensesIn(account, Month.JANUARY);
		expect(expenses.length).toBe(2);
		expect(expenses[0].amount).toBe(2);
		expect(expenses[1].amount).toBe(3);

		expenses = util.getExpensesIn(account, Month.FEBRUARY);
		expect(expenses.length).toBe(0);

		expenses = util.getExpensesIn(account, Month.JULY);
		expect(expenses.length).toBe(2);
		expect(expenses[0].amount).toBe(3);
		expect(expenses[1].amount).toBe(4);
	});

	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [
			createExpenseOn(1, [Month.JULY]),
			createExpenseOn(2, [Month.JULY], false)
		]);

		const util = new AccountBalanceUtil();
		const expenses = util.getExpensesIn(account, Month.JULY);
		expect(expenses.length).toBe(1);
		expect(expenses[0].amount).toBe(1);
	});

	test('Monthly expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [createExpenseOn(1, [])]);

		const util = new AccountBalanceUtil();
		const expenses = util.getExpensesIn(account, Month.JULY);
		expect(expenses.length).toBe(0);
	});
});

describe('Test for getMonthlyBudgetTransferAmount', () => {
	test('Various months', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [
			createExpenseOn(1200, [Month.JANUARY]),
			createExpenseOn(600, [Month.JANUARY, Month.JULY]),
			createExpenseOn(1200, [Month.JULY])
		]);

		const util = new AccountBalanceUtil();
		const amount = util.getMonthlyBudgetTransferAmount(account);
		expect(amount).toBe(300);
	});

	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [
			createExpenseOn(1200, [Month.JULY], false)
		]);

		const util = new AccountBalanceUtil();
		const amount = util.getMonthlyBudgetTransferAmount(account);
		expect(amount).toBe(0);
	});

	test('Monthly expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, [
			createExpenseOn(100, [])
		]);

		const util = new AccountBalanceUtil();
		const amount = util.getMonthlyBudgetTransferAmount(account);
		expect(amount).toBe(0);
	});
});

function createExpenseOn(amount: number, months: Month[], isEnabled: boolean = true) {
	const expense = new Expense(
		{
			id: 0,
			name: 'Test',
			amount: amount,
			tag: 'tag',
			accountId: 0,
			isEnabled: isEnabled,
			isShared: false,
			userId: userIds
		},
		[]
	);

	for (let i = 0; i < months.length; i++) {
		expense.addPaymentDate(
			new PaymentDate({
				id: 0,
				expenseId: expense.id,
				month: months[i],
				userId: userIds
			})
		);
	}

	return expense;
}

function createAccountWithSinglePaymentExpense(month: Month) {
	const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
	const expense = new Expense(
		{
			id: 1,
			name: 'Test',
			amount: 1200,
			tag: 'Test',
			accountId: account.id,
			isEnabled: true,
			isShared: false,
			userId: userIds
		},
		[]
	);

	expense.paymentDates = [
		new PaymentDate({
			id: 1,
			expenseId: expense.id,
			month: month,
			userId: userIds
		})
	];

	account.expenses = [expense];

	return account;
}

function createAccountWithPaymentDates(amount: number, paymentDates: PaymentDate[]) {
	const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

	const expense = new Expense(
		{
			id: 1,
			name: 'Test',
			amount: amount,
			tag: 'Test',
			accountId: account.id,
			isEnabled: true,
			isShared: false,
			userId: userIds
		},
		[]
	);

	expense.paymentDates = paymentDates;
	account.expenses = [expense];

	return account;
}
