import type { Locator, Page } from '@playwright/test';

export abstract class AppPage {
	protected readonly page: Page;
	protected readonly header: Locator;
	protected readonly subTitle: Locator;

	constructor(page: Page) {
		this.page = page;
		this.header = page.locator('h1', { hasText: this.getHeaderText() });
		this.subTitle = page.locator('p', { hasText: this.getSubTitleText() });
	}

	protected abstract getHeaderText(): string;

	protected abstract getSubTitleText(): string;

	async clickHeader() {
		await this.header.click();
	}
}
