<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import IconXMark from '$lib/icons/IconXMark.svelte';
	import { _ } from 'svelte-i18n';
	import type { PaymentDate } from '$lib/models/PaymentDate';
	import { DateUtil } from '$lib/util/DateUtil';

	export let paymentDate: PaymentDate;
	export let disabled = false;
	export let onInputRemoved: (paymentDate: PaymentDate) => void;
	let self: HTMLDivElement;

	const months: SelectOption<number>[] = [];
	for (let i = 0; i < 12; i++) {
		months.push({
			value: i,
			text: DateUtil.getMonthName(i)
		});
	}

	function removeSelf() {
		self.parentNode?.removeChild(self);
		onInputRemoved(paymentDate);
	}
</script>

<div bind:this={self} class="flex space-x-3">
	<span class="grow">
		<SelectField
			value={paymentDate.month}
			name="month"
			label={$_('calendarDatePicker.month')}
			required={true}
			{disabled}
			options={months}
		/>
	</span>
	<div>
		<button
			{disabled}
			on:click={removeSelf}
			type="button"
			class="variant-filled btn-icon mt-6 bg-error-600"
		>
			<IconXMark cssClass="w-8 h-8" />
		</button>
	</div>
</div>
