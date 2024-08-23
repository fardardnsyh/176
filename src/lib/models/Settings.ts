import type { SettingsRecord } from '$lib/tables/SettingsTable';

/**
 * A record for storing user settings.
 */
export class Settings {
	private record: SettingsRecord;

	constructor(record: SettingsRecord) {
		this.record = record;
		if (this.record.income != null) {
			this.record.income = +this.record.income;
		}
	}

	public get id() {
		return this.record.id;
	}

	public get income() {
		return this.record.income;
	}

	public get locale() {
		return this.record.locale;
	}

	public get partnerId() {
		return this.record.partnerId;
	}

	public get userId() {
		return this.record.userId;
	}

	public serialize() {
		return JSON.stringify({
			id: this.id,
			userId: this.userId,
			locale: this.locale,
			income: this.income,
			partherId: this.partnerId
		});
	}

	public static parse(json: string) {
		const parsed = JSON.parse(json);

		return new Settings({
			userId: parsed.userId,
			id: parsed.id,
			locale: parsed.locale,
			income: parsed.income,
			partnerId: parsed.partnerId
		});
	}
}
