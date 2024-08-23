import type { Locator, Page } from '@playwright/test';
import { AppPage } from './app-page';

export class EditAccountPage extends AppPage {
	readonly nameTextbox: Locator;
	readonly sharedAccountCheckbox: Locator;
	readonly saveButton: Locator;

	constructor(page: Page) {
		super(page);

		this.nameTextbox = page.getByLabel('Name');
		this.sharedAccountCheckbox = page.getByLabel('Shared account');
		this.saveButton = page.getByRole('button', { name: 'Save' });
	}

	protected getHeaderText(): string {
		return 'Edit account';
	}

	protected getSubTitleText(): string {
		return "Use the below fields to change the account's details";
	}
}
