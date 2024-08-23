<script lang="ts">
	import IconMagnifyingGlass from '$lib/icons/IconMagnifyingGlass.svelte';

	export let hasFocus = false;
	export let value: string;
	export let onValueChanged: (value: string) => void;
	let input: HTMLInputElement;
	let timeoutId: number;

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'Enter') {
			(event.target as HTMLInputElement).blur();
		}
	}

	function onInput(event: Event) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		const target = event.target as HTMLInputElement;
		const value = target.value;

		if (value.trim() === '') {
			onValueChanged('');
		} else {
			timeoutId = window.setTimeout(() => onValueChanged(value), 400);
		}
	}
</script>

<button on:click={() => input.focus()} class="w-full cursor-text">
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div>
			<IconMagnifyingGlass cssClass="w-6 h-6 text-gray-600" />
		</div>

		<input
			on:focusin={() => {
				hasFocus = true;
			}}
			on:focusout={() => {
				hasFocus = false;
			}}
			on:keydown={onKeydown}
			on:input={onInput}
			bind:this={input}
			bind:value
			type="search"
		/>
	</div>
</button>
