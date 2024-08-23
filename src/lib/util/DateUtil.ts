export class DateUtil {
	private static numericFormat = Intl.DateTimeFormat('da-DK', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		minute: undefined,
		second: undefined
	});

	private static longFormat = Intl.DateTimeFormat('da-DK', {
		year: undefined,
		month: 'long',
		day: undefined,
		minute: undefined,
		second: undefined
	});

	private static monthNameFormat = Intl.DateTimeFormat('da-DK', {
		year: undefined,
		month: 'long',
		day: undefined,
		minute: undefined,
		second: undefined
	});

	public static localize(date: Date) {
		return DateUtil.numericFormat.format(date);
	}

	public static localizeLongerFormat(date: Date) {
		return DateUtil.longFormat.format(date);
	}

	public static getMonthName(month: number) {
		return DateUtil.monthNameFormat.format(new Date(1974, month, 1));
	}

	public static getMonthsBetween(fromDate: Date, toDate: Date) {
		const yearsBetween = toDate.getFullYear() - fromDate.getFullYear();
		return toDate.getMonth() - fromDate.getMonth() + 12 * yearsBetween;
	}
}
