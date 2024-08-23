import type { Locator } from '@playwright/test';

export class ExpenseCard {
	readonly aTag: Locator;
	readonly header: Locator;
	readonly tag: Locator;
	readonly nextPaymentDate: Locator;
	readonly amountParagraph: Locator;
	readonly monthParagraph: Locator;
	readonly paymentFrequency: Locator;

	constructor(aTag: Locator) {
		this.aTag = aTag;
		this.header = aTag.locator('div > h2');
		this.tag = aTag.locator('div > small', { hasNotText: '/month' });
		this.nextPaymentDate = aTag.locator('div', { hasText: 'Next payment: ' });
		this.amountParagraph = aTag.locator('h1', { hasText: new RegExp('^.*kr.$') });
		this.monthParagraph = aTag.locator('p', { hasText: '/month' });
		this.paymentFrequency = aTag.locator('p', { hasText: 'Paid ' });
	}

	async click() {
		await this.aTag.click();
	}
}
