<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import NumberField from '$lib/components/NumberField.svelte';
	import { Settings } from '$lib/models/Settings.js';
	import { enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { _ } from 'svelte-i18n';

	const toastStore = getToastStore();

	export let data;
	export let form;

	if (form?.error) {
		toastStore.trigger({
			message: form.error,
			background: 'variant-filled-error'
		});
	}

	let isSaving = false;
	const settings = Settings.parse(data.settings);
</script>

<div class="card mt-5 space-y-3 bg-white p-10">
	<div class="flex">
		<div class="flex-grow">
			<label class="label" for="light-switch">Dark mode</label>
			<LightSwitch disabled={isSaving} class="mt-1" id="light-switch" />
		</div>
	</div>

	<form
		class="space-y-8"
		method="post"
		action="?/save"
		use:enhance={() => {
			isSaving = true;

			return async ({ update }) => {
				await update();
				isSaving = false;

				toastStore.trigger({
					message: $_('settings.saved'),
					background: 'variant-filled-primary',
					classes: 'text-white',
					hideDismiss: true
				});
			};
		}}
	>
		<NumberField
			name="income"
			label={$_('user.income')}
			required={true}
			disabled={isSaving}
			value={settings.income}
		/>

		<button disabled={isSaving} class="variant-filled btn w-full basis-1/4 bg-primary-500 sm:w-auto"
			>{$_('button.save')}</button
		>
	</form>
</div>
