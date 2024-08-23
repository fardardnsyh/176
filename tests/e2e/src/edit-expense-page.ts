import type { Locator, Page } from '@playwright/test';
import { AppPage } from './app-page';

export class EditExpensePage extends AppPage {
	readonly nameTextbox: Locator;
	readonly amountTextbox: Locator;
	readonly isSharedSelect: Locator;
	readonly groupTextbox: Locator;
	readonly isActiveCheckbox: Locator;
	readonly addPaymentDateButton: Locator;
	readonly saveButton: Locator;

	constructor(page: Page) {
		super(page);

		this.nameTextbox = page.getByLabel('Name');
		this.amountTextbox = page.getByLabel('Amount');
		this.isSharedSelect = page.getByLabel('The expense is');
		this.groupTextbox = page.getByLabel('Group');
		this.isActiveCheckbox = page.getByLabel('Is active');
		this.addPaymentDateButton = page.getByRole('button', { name: 'Add date' });
		this.saveButton = page.getByRole('button', { name: 'Save' });
	}

	protected getHeaderText(): string {
		return 'Edit expense';
	}
	protected getSubTitleText(): string {
		return "Use the below fields to change the expense's details";
	}
}
