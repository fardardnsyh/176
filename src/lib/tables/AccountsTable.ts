import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface AccountsTable {
	id: Generated<number>;
	userId: string[];
	name: string;
}

export type AccountRecord = Selectable<AccountsTable>;
export type InsertableAccountRecord = Insertable<AccountsTable>;
export type UpdateableAccountRecord = Updateable<AccountsTable>;
