import type { Locator } from '@playwright/test';

export class AccountCard {
	readonly card: Locator;
	readonly header: Locator;
	readonly arrowIcon: Locator;
	readonly amountParagraph: Locator;
	readonly monthParagraph: Locator;

	constructor(aTag: Locator) {
		this.card = aTag;
		this.header = aTag.locator('h2');
		this.arrowIcon = aTag.locator('svg');
		this.amountParagraph = aTag.locator('p', { hasText: new RegExp('^.*kr.$') });
		this.monthParagraph = aTag.locator('p', { hasText: '/month' });
	}

	async click() {
		await this.card.click();
	}
}
