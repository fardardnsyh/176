import { AccountClient } from '$lib/clients/AccountClient.js';
import { SettingsClient } from '$lib/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (session == null) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;

	let account = null;
	if (id != 0) {
		account = await accountClient.getById(id);
	}

	return {
		session: session,
		account: account?.serialize()
	};
}

export const actions = {
	save: async ({ request, params, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const isShared = data.get('shared') == 'on';

		if (name == null || name.trim().length == 0) {
			return {
				error: 'Name is required'
			};
		}

		const session = await locals.auth();

		if (session == null) {
			redirect(303, '/');
		}

		const id = +params.accountId;
		const client = new AccountClient(session.user.id);

		const userIds = [session.user.id];
		if (isShared) {
			const settingsClient = new SettingsClient(session.user.id);
			const setting = await settingsClient.getForCurrentUser();

			const partnerId = setting.partnerId;
			if (partnerId != null) {
				userIds.push(partnerId);
			}
		}

		if (id == 0) {
			await client.create({ name: name, userId: userIds });
		} else {
			await client.update(id, { name: name, userId: userIds });
		}

		redirect(303, '/accounts');
	},

	delete: async ({ params, locals }) => {
		const session = await locals.auth();

		if (session == null) {
			redirect(303, '/');
		}

		const client = new AccountClient(session.user.id);
		const id = +params.accountId;
		const result = await client.delete(id);

		if (result.getError() != null) {
			return {
				error: result.getError()
			};
		}

		redirect(303, '/accounts');
	}
};
