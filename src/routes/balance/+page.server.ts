import { AccountClient } from '$lib/clients/AccountClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session == null) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);
	const accounts = await accountClient.listAllExpanded();

	return {
		session: session,
		accounts: accounts.map((account) => account.serialize())
	};
};
