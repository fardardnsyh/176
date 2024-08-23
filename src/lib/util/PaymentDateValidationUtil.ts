import type { Month } from '$lib/enums/Month';

export default class PaymentDateValidationUtil {
	public static validateCombination(months: Month[]): boolean {
		const validLengths = [0, 1, 2, 4, 12];

		if (!validLengths.includes(months.length)) {
			return false;
		}

		// Duplicate months
		if (new Set(months).size != months.length) {
			return false;
		}

		if (months.length <= 1) {
			return true;
		}

		// Sort the months numerically
		const sortedMonths = months.slice().sort((a, b) => a - b);

		// Calculate the difference between consecutive months (consider circular wrap-around)
		const differences = new Set<number>();
		for (let i = 0; i < sortedMonths.length; i++) {
			const nextMonth = sortedMonths[(i + 1) % sortedMonths.length];
			const difference = (nextMonth - sortedMonths[i] + 12) % 12;
			differences.add(difference);
		}

		// Check if all differences are the same
		return differences.size == 1;
	}
}
