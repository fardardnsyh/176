import { Month } from '$lib/enums/Month';
import PaymentDateValidationUtil from '$lib/util/PaymentDateValidationUtil';
import { describe, expect, test } from 'vitest';

describe('Tests for PaymentDateValidationUtil', () => {
	test('Test monthly expense is valid', () => {
		let months = [
			Month.JANUARY,
			Month.FEBRUARY,
			Month.MARCH,
			Month.APRIL,
			Month.MAY,
			Month.JUNE,
			Month.JULY,
			Month.AUGUST,
			Month.SEPTEMBER,
			Month.OCTOBER,
			Month.NOVEMBER,
			Month.DECEMBER
		];
		let result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);

		months = [];
		result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);
	});

	test('Test yearly expense is valid', () => {
		let months = [Month.JANUARY];
		let result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);

		months = [Month.MARCH];
		result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);
	});

	test('Test half-yearly expense is valid', () => {
		let months = [Month.JANUARY, Month.JULY];
		let result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);

		months = [Month.MARCH, Month.SEPTEMBER];
		result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);
	});

	test('Test quarterly expense is valid', () => {
		let months = [Month.JANUARY, Month.APRIL, Month.JULY, Month.OCTOBER];
		let result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);

		months = [Month.FEBRUARY, Month.MAY, Month.AUGUST, Month.NOVEMBER];
		result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(true);
	});

	test('Test invalid number of months', () => {
		const months = [Month.JANUARY, Month.FEBRUARY, Month.MARCH];
		const result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(false);
	});

	test('Test duplicate months are invalid', () => {
		const months = [Month.JANUARY, Month.JANUARY];
		const result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(false);
	});

	test('Test invalid spacing of months', () => {
		let months = [Month.JANUARY, Month.FEBRUARY];
		let result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(false);

		months = [Month.MARCH, Month.MAY, Month.AUGUST];
		result = PaymentDateValidationUtil.validateCombination(months);
		expect(result).toBe(false);
	});
});
