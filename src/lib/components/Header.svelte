<script lang="ts">
	import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
	import IconBarsThree from '$lib/icons/IconBarsThree.svelte';
	import IconPencilSquare from '$lib/icons/IconPencilSquare.svelte';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { _ } from 'svelte-i18n';
	import { signOut } from '@auth/sveltekit/client';

	export let title: string;
	export let titleParams = undefined;
	export let details: string;
	export let backHref: string | undefined = undefined;
	export let editHref: string | undefined = undefined;

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom'
	};
</script>

<div class="flex space-x-2">
	<div class="flex flex-grow">
		{#if backHref}
			<a class="mr-2 mt-2" href={backHref}>
				<button type="button" class="variant-filled btn-icon" aria-label="Back button">
					<IconArrowLeft cssClass="h-8 w-8" />
				</button>
			</a>
		{/if}

		<div>
			{#if editHref}
				<a class="flex space-x-1" href={editHref} aria-label="Edit">
					<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
					<IconPencilSquare cssClass="flex-none h-5 w-5" />
				</a>
				<p>{$_(details)}</p>
			{:else}
				<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
				<p>{$_(details)}</p>
			{/if}
		</div>
	</div>

	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/accounts" rel="noreferrer"
		>{$_('accounts.title')}</a
	>
	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/balance" rel="noreferrer"
		>{$_('currentAmount.title')}</a
	>

	<div>
		<button
			class="variant-ghost-surface btn-icon btn-sm h-8 w-8"
			use:popup={userMenuPopup}
			aria-label="Menu button"
		>
			<IconBarsThree cssClass="w-6 h-6" />
		</button>
	</div>

	<div data-popup="userMenuPopup" class="z-50">
		<div class="borderborder-gray-400 card mr-3 mt-3 w-40 space-y-2 p-4 shadow-xl">
			<a class="variant-ghost btn w-full md:hidden" href="/accounts" rel="noreferrer"
				>{$_('accounts.title')}</a
			>
			<a class="variant-ghost btn w-full md:hidden" href="/balance" rel="noreferrer"
				>{$_('currentAmount.title')}</a
			>
			<a class="variant-ghost btn w-full" href="/settings" rel="noreferrer"
				>{$_('settings.title')}</a
			>
			<button class="variant-ghost btn w-full" on:click={() => signOut()}>{$_('signOut')}</button>
		</div>
	</div>
</div>
