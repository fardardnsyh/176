import { expect, test } from '@playwright/test';
import { AccountsPage } from './src/accounts-page';
import { App } from './src/app';
import { ExpensesPage } from './src/expenses-page';

test.beforeEach(async ({ page }) => {
	await App.signInAndReset(page);
});

test('add and edit an account', async ({ page }) => {
	const accountsPage = await AccountsPage.goto(page);

	/*
	Add a new account
	*/
	const editAccountsPage = await accountsPage.clickNewAccountButton();
	const accountName = 'Playwright test account';
	await editAccountsPage.nameTextbox.fill(accountName);
	await editAccountsPage.saveButton.click();

	let card = await accountsPage.getAccountCardWithTitle(accountName);
	await expect(card.header).toHaveText(accountName);
	await expect(card.amountParagraph).toHaveText('0\u00A0kr.');

	/*
	Verify that the account is empty
	*/
	await card.click();
	const expensesPage = new ExpensesPage(page, accountName);
	const noEntriesComponent = expensesPage.getNoEntriesComponent();
	await expect(noEntriesComponent.topComment).toHaveText('It seems that I have no expenses...');
	await expect(noEntriesComponent.bottomComment).toBeVisible();

	/*
	Edit the account
	*/
	await expensesPage.clickHeader();
	const newAccountName = 'Changed test account';
	await editAccountsPage.nameTextbox.fill(newAccountName);
	await editAccountsPage.saveButton.click();

	card = await accountsPage.getAccountCardWithTitle(newAccountName);
	await expect(card.header).toHaveText(newAccountName);
	await expect(card.amountParagraph).toHaveText('0\u00A0kr.');
});
