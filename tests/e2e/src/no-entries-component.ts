import type { Locator, Page } from '@playwright/test';

export class NoEntriesComponent {
	readonly topComment: Locator;
	readonly bottomComment: Locator;

	constructor(page: Page) {
		this.topComment = page.locator('p', { hasText: 'It seems that I have no' });

		this.bottomComment = page.locator('p', {
			hasText: 'You can use the button above to add some 🙂'
		});
	}
}
