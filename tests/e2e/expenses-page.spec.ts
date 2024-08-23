import { test } from '@playwright/test';
import { AccountsPage } from './src/accounts-page';
import { App } from './src/app';
import { ExpensesPage } from './src/expenses-page';

test.beforeEach(async ({ page }) => {
	await App.signInAndReset(page);
});

test('create and edit an expense', async ({ page }) => {
	const accountsPage = await AccountsPage.goto(page);

	/*
	Add a new account
	*/
	const editAccountsPage = await accountsPage.clickNewAccountButton();
	const accountName = 'Test of expenses page';
	await editAccountsPage.nameTextbox.fill(accountName);
	await editAccountsPage.saveButton.click();

	const accountCard = await accountsPage.getAccountCardWithTitle(accountName);
	await accountCard.click();
	const expensesPage = new ExpensesPage(page, accountName);

	/*
	Add an expense
	*/
	const editExpensePage = await expensesPage.clickNewExpenseButton();
	await editExpensePage.nameTextbox.fill('First expense');
	await editExpensePage.amountTextbox.fill('123.45');
	await editExpensePage.groupTextbox.fill('some group');
	await editExpensePage.saveButton.click();
});
