import type { Month } from '$lib/enums/Month';
import type { Generated, Insertable, Selectable } from 'kysely';

export interface PaymentDatesTable {
	id: Generated<number>;
	userId: string[];
	expenseId: number;
	month: Month;
}

export type PaymentDateRecord = Selectable<PaymentDatesTable>;
export type InsertablePaymentDateRecord = Insertable<PaymentDatesTable>;
