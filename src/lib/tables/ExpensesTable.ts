import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface ExpensesTable {
	id: Generated<number>;
	userId: string[];
	name: string;
	amount: number;
	isShared: boolean;
	tag: string | null;
	accountId: number;
	isEnabled: boolean;
}

export type ExpenseRecord = Selectable<ExpensesTable>;
export type InsertableExpenseRecord = Insertable<ExpensesTable>;
export type UpdateableExpenseRecord = Updateable<ExpensesTable>;
