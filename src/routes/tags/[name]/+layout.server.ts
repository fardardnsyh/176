export const load = async (event) => {
	const tagName = event.params.name;

	return {
		title: tagName,
		details: 'tagView.details',
		backHref: '/'
	};
};
