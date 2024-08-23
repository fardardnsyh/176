import type { Month } from '$lib/enums/Month';
import type { Account } from '$lib/models/Account';
import type { Expense } from '$lib/models/Expense';
import { DateUtil } from './DateUtil';

/**
 * Utility for calculating the current amount that should be on an account, to avoid overdrawing. This is done using the
 * account's expenses and their payment dates
 */
export class AccountBalanceUtil {
	/**
	 * The only values that this utility considers, are the year and month. Everything is floored to the lowest possible
	 * value.
	 * @param date the date to floor
	 */
	private floorDate(date: Date) {
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
	}

	/**
	 * Get the current amount that should be on the given account, to avoid overdrawing.
	 *
	 * @param account the account to calculate the amount for
	 * @returns the amount that should currently be on the account
	 */
	public getCurrentAmmount(account: Account) {
		return this.getAccountBalanceOn(account, new Date());
	}

	/**
	 * Get the current amount that should be on the given account, to avoid overdrawing.
	 *
	 * @param account the account to calculate the amount for
	 * @param date
	 * @returns the amount that should currently be on the account
	 */
	public getAccountBalanceOn(account: Account, date: Date): number {
		this.floorDate(date);
		let accountBalance = 0;

		for (const expense of account.expenses) {
			if (!expense.isEnabled) {
				continue;
			}

			if (expense.isMonthlyExpense) {
				continue;
			}

			const nextPaymentDate = this.getNextPaymentDateForExpenseAfter(expense, date);

			if (nextPaymentDate == null) {
				continue;
			}

			const remainingNumberOfTransfers = DateUtil.getMonthsBetween(date, nextPaymentDate);
			const monthlyAmount = expense.monthlyAmountWithTotalShared;
			const amountNotYetTransfered = monthlyAmount * remainingNumberOfTransfers;
			const amount = expense.amount - amountNotYetTransfered;
			accountBalance += Math.ceil(amount);
		}

		return accountBalance;
	}

	/**
	 * Get the next date when a payment will occur on the given account
	 *
	 * @param account the account to use when calculating the date
	 * @returns the next date from today when a payment will occur, or NULL
	 */
	public getNextPaymentDate(account: Account): Date | null {
		let nextPaymentDate: Date | null = null;

		for (const expense of account.expenses) {
			if (!expense.isEnabled) {
				continue;
			}

			const expensePaymentDate = this.getNextPaymentDateForExpense(expense);

			if (expensePaymentDate == null) {
				continue;
			}

			if (nextPaymentDate == null || nextPaymentDate > expensePaymentDate) {
				nextPaymentDate = expensePaymentDate;
			}
		}

		return nextPaymentDate;
	}

	/**
	 * Get the next date when a payment will occur on the given expense
	 *
	 * @param expense the expense to use when calculating the date
	 * @returns the next date from today when a payment will occur, or NULL
	 */
	public getNextPaymentDateForExpense(expense: Expense): Date | null {
		return this.getNextPaymentDateForExpenseAfter(expense, new Date());
	}

	/**
	 * Get the next date when a payment will occur on the given expense, after a given date.
	 *
	 * @param expense the expense to use when calculating the date
	 * @param startDate the date which the expense must occur after
	 * @returns the next date when a payment will occur, or NULL
	 */
	public getNextPaymentDateForExpenseAfter(expense: Expense, startDate: Date): Date | null {
		this.floorDate(startDate);
		let nextPaymentDate: Date | null = null;
		const thisYear = startDate.getFullYear();

		if (expense.isMonthlyExpense) {
			const nextMonth = startDate.getMonth() + 1;
			return new Date(thisYear, nextMonth, 1);
		}

		for (const paymentDate of expense.paymentDates) {
			const date = new Date(thisYear, paymentDate.month, 1);

			if (date <= startDate) {
				date.setFullYear(thisYear + 1);
			}

			if (nextPaymentDate == null || nextPaymentDate > date) {
				nextPaymentDate = date;
			}
		}

		return nextPaymentDate;
	}

	/**
	 * Get all an account's expenses, set to occur in a given month. This does not include monthly expenses.
	 *
	 * @param account the account containing the expenses
	 * @param month the month to find expenses in
	 * @returns all expenses explicitly set to be paid in the given month
	 */
	public getExpensesIn(account: Account, month: Month): Expense[] {
		const expenses: Expense[] = [];

		for (const expense of account.expenses) {
			if (!expense.isEnabled || expense.isMonthlyExpense) {
				continue;
			}

			const isInMonth = expense.paymentDates.some((d) => d.month === month);

			if (isInMonth) {
				expenses.push(expense);
			}
		}

		return expenses;
	}

	/**
	 * Get the amount transfered every month to the account. This amount is a budget transfer amount, meaning that it
	 * does not include monthly payments
	 *
	 * @param account the account to use when calculating the amount
	 * @returns the monthly amount transfered to the account
	 */
	public getMonthlyBudgetTransferAmount(account: Account) {
		let amount = 0;

		for (const expense of account.expenses) {
			if (!expense.isEnabled || expense.isMonthlyExpense) {
				continue;
			}
			amount += expense.monthlyAmountWithTotalShared;
		}

		return amount;
	}
}
