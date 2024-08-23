import { AccountClient } from '$lib/clients/AccountClient.js';

export const load = async (event) => {
	const session = await event.locals.auth();
	if (session == null) {
		throw Error('Invalid session');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;
	if (id === 0 || isNaN(id)) {
		return {
			title: '',
			details: ''
		};
	}

	const account = await accountClient.getById(id);
	if (account == null) {
		throw Error('Could not get account #' + id);
	}

	return {
		title: 'accountBalance.title',
		titleParams: { account: account.name },
		details: 'accountBalance.details',
		backHref: '.'
	};
};
