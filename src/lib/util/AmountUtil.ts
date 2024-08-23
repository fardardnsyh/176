export class AmountUtil {
	private static decimalFormatter = Intl.NumberFormat('da-DK', {
		style: 'currency',
		currency: 'DKK'
	});

	private static integerFormatter = Intl.NumberFormat('da-DK', {
		style: 'currency',
		currency: 'DKK',
		maximumFractionDigits: 0
	});

	public static localizeDecimal(amount: number) {
		return AmountUtil.decimalFormatter.format(amount);
	}

	public static localizeInteger(amount: number) {
		return AmountUtil.integerFormatter.format(Math.ceil(amount));
	}
}
