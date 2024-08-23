import { AmountUtil } from '$lib/util/AmountUtil';
import { describe, expect, test } from 'vitest';

describe('Tests for AmountUtil', () => {
	test('Test for localize', () => {
		let amount = AmountUtil.localizeDecimal(0);
		expect(amount).toBe('0,00 kr.');

		amount = AmountUtil.localizeDecimal(1);
		expect(amount).toBe('1,00 kr.');

		amount = AmountUtil.localizeDecimal(1.454);
		expect(amount).toBe('1,45 kr.');

		amount = AmountUtil.localizeDecimal(1.456);
		expect(amount).toBe('1,46 kr.');

		amount = AmountUtil.localizeDecimal(12);
		expect(amount).toBe('12,00 kr.');

		amount = AmountUtil.localizeDecimal(123);
		expect(amount).toBe('123,00 kr.');

		amount = AmountUtil.localizeDecimal(1234);
		expect(amount).toBe('1.234,00 kr.');

		amount = AmountUtil.localizeDecimal(123456);
		expect(amount).toBe('123.456,00 kr.');
	});
});
