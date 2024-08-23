import { ExpenseClient } from '$lib/clients/ExpenseClient';
import { PaymentDateClient } from '$lib/clients/PaymentDateClient.js';
import { SettingsClient } from '$lib/clients/SettingsClient';
import { Month } from '$lib/enums/Month.js';
import type { Expense } from '$lib/models/Expense.js';
import type { PaymentDate } from '$lib/models/PaymentDate.js';
import PaymentDateValidationUtil from '$lib/util/PaymentDateValidationUtil.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();

	if (session == null) {
		redirect(303, '/');
	}

	const expenseClient = new ExpenseClient(session.user.id);
	const id = +event.params.expenseId;

	let expense: Expense | null = null;
	if (id != 0 && !isNaN(id)) {
		expense = await expenseClient.getById(id);

		if (expense == null) {
			redirect(303, '/accounts/' + event.params.accountId);
		}
	}

	const paymentDateClient = new PaymentDateClient(session.user.id);
	let paymentDates: PaymentDate[] = [];
	if (expense != null) {
		paymentDates = await paymentDateClient.listAll({ expenseId: expense.id });
	}

	return {
		session: session,
		expense: expense?.serialize(),
		tags: await expenseClient.listAllTags(),
		paymentDates: paymentDates.map((d) => d.serialize())
	};
}

export const actions = {
	save: async ({ request, params, locals }) => {
		const session = await locals.auth();

		if (session == null) {
			redirect(303, '/');
		}

		const data = await request.formData();
		const name = data.get('name')?.toString();
		const amount = +(data.get('amount')?.toString() || '');
		const tag = data.get('tag')?.toString();
		const isEnabled = !!data.get('isEnabled');
		const isShared = data.get('isShared') == 'true';
		const monthNumbers: number[] = data.getAll('month').map(Number);
		const months: Month[] = monthNumbers.map((month) => month as Month);

		if (name == null || amount == 0 || isNaN(amount)) {
			return fail(400, { error: 'expense.error.requiredFields' });
		}

		if (!PaymentDateValidationUtil.validateCombination(months)) {
			return fail(400, { error: 'expense.error.invalidCombinationOfMonths' });
		}

		const id = +params.expenseId;
		const accountId = +params.accountId;

		const userIds = [session.user.id];
		if (isShared) {
			const settingsClient = new SettingsClient(session.user.id);
			const setting = await settingsClient.getForCurrentUser();

			const partnerId = setting.partnerId;
			if (partnerId != null) {
				userIds.push(partnerId);
			}
		}

		const expenseClient = new ExpenseClient(session.user.id);

		let newExpense: Expense;
		if (id == 0) {
			newExpense = await expenseClient.create({
				userId: userIds,
				name: name,
				amount: amount,
				accountId: accountId,
				isEnabled: isEnabled,
				isShared: isShared,
				tag: tag
			});
		} else {
			newExpense = await expenseClient.update(id, {
				userId: userIds,
				name: name,
				amount: amount,
				accountId: accountId,
				isEnabled: isEnabled,
				isShared: isShared,
				tag: tag
			});
		}

		const paymentDateClient = new PaymentDateClient(session.user.id);

		if (id != 0) {
			await paymentDateClient.deleteAllBelongingTo(id);
		}

		for (const month of months) {
			const createdPaymentDate = await paymentDateClient.create({
				userId: userIds,
				expenseId: newExpense.id,
				month: +month
			});

			if (createdPaymentDate == null) {
				return fail(400, { error: 'Could not create payment date' });
			}
		}

		redirect(303, '/accounts/' + params.accountId);
	},

	delete: async ({ params, locals }) => {
		const session = await locals.auth();

		if (session == null) {
			redirect(303, '/');
		}

		const client = new ExpenseClient(session.user.id);
		const id = +params.expenseId;
		const result = await client.delete(id);

		if (result.getError() != null) {
			return fail(400, { error: result.getError() });
		}

		redirect(303, '/accounts/' + params.accountId);
	}
};
