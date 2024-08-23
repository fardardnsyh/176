import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface SettingsTable {
	id: Generated<number>;
	userId: string;
	locale: 'en' | 'da';
	income: number;
	partnerId: string | null;
}

export type SettingsRecord = Selectable<SettingsTable>;
export type InsertableSettingsRecord = Insertable<SettingsTable>;
export type UpdatableSettingsRecord = Updateable<SettingsTable>;
