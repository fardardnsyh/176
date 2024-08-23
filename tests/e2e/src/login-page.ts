import type { Page } from '@playwright/test';

export class LoginPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('auth/signin');
	}

	async clickSignInWithADemoUser() {
		await this.page.getByRole('button', { name: 'Sign in with a demo user' }).click();
	}
}
