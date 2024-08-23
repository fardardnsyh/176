<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import {
		SlideToggle,
		type AutocompleteOption,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import AutoCompletingTextField from '$lib/components/AutoCompletingTextField.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { PaymentDate } from '$lib/models/PaymentDate.js';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import { _ } from 'svelte-i18n';
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let form;
	export let data;
	const expense = data.expense != null ? Expense.parse(data.expense) : null;
	const paymentDates = data.paymentDates.map((d) => PaymentDate.parse(d));

	let isSaving = false;

	let tagOptions: AutocompleteOption[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	$: if (form?.error) {
		toastStore.trigger({
			message: $_(form.error),
			background: 'variant-filled-error'
		});
	}

	let shareOptions: SelectOption<boolean>[] = [
		{
			value: false,
			text: $_('expense.notShared')
		},
		{
			value: true,
			text: $_('expense.isShared')
		}
	];

	function showDeleteModal(): void {
		const component: ModalComponent = { ref: DeleteModal };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: $_('deleteExpense.title'),
			body: $_('deleteExpense.body'),
			buttonTextSubmit: $_('button.delete'),
			buttonTextCancel: $_('button.cancel')
		};
		modalStore.trigger(modal);
	}
</script>

<form
	class="space-y-4"
	method="POST"
	action="?/save"
	use:enhance={() => {
		isSaving = true;

		return async ({ update }) => {
			await update();
			isSaving = false;
		};
	}}
>
	<div class="card space-y-2 bg-white p-4">
		<TextField
			name="name"
			label={$_('expense.name')}
			autofocus={expense == null}
			required={true}
			value={expense?.name}
			disabled={isSaving}
		/>

		<div class="flex space-x-2">
			<span class="grow">
				<NumberField
					name="amount"
					label={$_('expense.amount')}
					required={true}
					value={expense?.amount}
					disabled={isSaving}
				/>
			</span>

			<SelectField
				name="isShared"
				label={$_('expense.shared.label')}
				options={shareOptions}
				value={expense?.isShared ?? false}
				disabled={isSaving}
			/>
		</div>

		<AutoCompletingTextField
			name="tag"
			label={$_('expense.group')}
			value={expense?.tag}
			options={tagOptions}
			disabled={isSaving}
		/>

		<SlideToggle
			disabled={isSaving}
			name="isEnabled"
			active="bg-primary-500"
			checked={expense?.isEnabled ?? true}>{$_('expense.isEnabled')}</SlideToggle
		>
	</div>

	<div class="card space-y-2 bg-white p-4">
		<PaymentDatePicker {paymentDates} disabled={isSaving} />
	</div>

	<div class="flex space-x-2 p-4">
		<button disabled={isSaving} class="variant-filled btn basis-1/4 bg-primary-500"
			>{$_('button.save')}</button
		>

		{#if expense != null}
			<button
				formnovalidate={true}
				disabled={isSaving}
				class="variant-filled btn basis-1/4"
				on:click|preventDefault={showDeleteModal}>{$_('button.delete')}</button
			>
		{/if}
	</div>
</form>
