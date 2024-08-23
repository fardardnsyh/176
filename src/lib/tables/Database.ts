import type { AccountsTable } from './AccountsTable';
import type { ExpensesTable } from './ExpensesTable';
import type { PaymentDatesTable } from './PaymentDatesTable';
import type { SettingsTable } from './SettingsTable';

export interface Database {
	settings: SettingsTable;
	accounts: AccountsTable;
	expenses: ExpensesTable;
	paymentDates: PaymentDatesTable;
}
