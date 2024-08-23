import type { Page } from '@playwright/test';
import { AppPage } from './app-page';
import { EditExpensePage } from './edit-expense-page';
import { NoEntriesComponent } from './no-entries-component';

export class ExpensesPage extends AppPage {
	private readonly accountName: string;

	constructor(page: Page, accountName: string) {
		super(page);

		this.accountName = accountName;
	}

	protected getHeaderText(): string {
		return this.accountName;
	}

	protected getSubTitleText(): string {
		return "Maintain the account's expenses";
	}

	getNoEntriesComponent() {
		return new NoEntriesComponent(this.page);
	}

	async clickNewExpenseButton() {
		await this.page.getByLabel('Add new expense').click();
		return new EditExpensePage(this.page);
	}
}
