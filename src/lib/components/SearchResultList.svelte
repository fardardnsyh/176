<script lang="ts">
	import IconBankNotes from '$lib/icons/micro/IconBankNotes.svelte';
	import IconBuildingLibrary from '$lib/icons/micro/IconBuildingLibrary.svelte';
	import IconTag from '$lib/icons/micro/IconTag.svelte';
	import { RecordType } from '$lib/models/SearchResult';
	import type SearchResult from '$lib/models/SearchResult';

	export let results: SearchResult[];
	export let onSearchResultClicked: () => void;

	function getResultSymbol(result: SearchResult) {
		switch (result.recordType) {
			case RecordType.ACCOUNT:
				return IconBuildingLibrary;
			case RecordType.EXPENSE:
				return IconBankNotes;
			case RecordType.TAG:
				return IconTag;
		}
	}
</script>

<nav class="card list-nav bg-white p-2 shadow-2xl">
	<ul>
		{#each results as result}
			<li>
				<a
					on:click={() => {
						onSearchResultClicked();
					}}
					href={result.url}
					data-sveltekit-reload
				>
					<span class="badge">
						<svelte:component this={getResultSymbol(result)} />
					</span>
					<span class="flex-auto">{result.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
