<script lang="ts">
	import { PaymentDate } from '$lib/models/PaymentDate';
	import MonthPicker from '$lib/components/MonthPicker.svelte';
	import { _ } from 'svelte-i18n';
	import { Month } from '$lib/enums/Month';
	import IconChatBubbleOvalLeftEllipsis from '$lib/icons/IconChatBubbleOvalLeftEllipsis.svelte';

	export let paymentDates: PaymentDate[];
	paymentDates.sort((d1, d2) => d1.month - d2.month);
	export let disabled = false;

	function onInputRemoved(paymentDate: PaymentDate) {
		paymentDates = paymentDates.filter((p) => {
			return p.id != paymentDate.id;
		});
	}

	function addInput() {
		const newPaymentDate = new PaymentDate({
			id: Math.random(),
			expenseId: 0,
			month: Month.JANUARY,
			userId: []
		});

		paymentDates = [...paymentDates, newPaymentDate];
	}
</script>

<div class="flex space-x-3">
	<p class="text-xl">{$_('paymentDates')}</p>
	<button {disabled} on:click={addInput} type="button" class="variant-filled btn btn-sm">
		{$_('addDate')}
	</button>
</div>

{#each paymentDates as paymentDate (paymentDate.id)}
	<MonthPicker {paymentDate} {disabled} {onInputRemoved} />
{/each}

{#if paymentDates.length === 0}
	<div class="flex">
		<IconChatBubbleOvalLeftEllipsis cssClass="h-5 w-5" />
		<span class="text-sm">{$_('expense.isMonthly.explanation')}</span>
	</div>
{/if}
