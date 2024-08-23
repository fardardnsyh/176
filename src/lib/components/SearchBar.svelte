<script lang="ts">
	import type SearchResult from '$lib/models/SearchResult';
	import SearchField from './SearchField.svelte';
	import SearchResultList from './SearchResultList.svelte';

	let results: SearchResult[] = [];
	let searchFieldValue: string = '';

	async function onSearchValueChanged(value: string) {
		if (value.trim() === '') {
			results = [];
			return;
		}

		const query = encodeURIComponent(value);
		const response = await fetch(`/api/search?q=${query}`);

		if (!response.ok) {
			console.error('Server error:', response.statusText);
			return;
		}

		const json = await response.json();

		results = json;
	}
</script>

<SearchField bind:value={searchFieldValue} onValueChanged={onSearchValueChanged} />

{#if results.length > 0}
	<div class="mt-2">
		<SearchResultList
			onSearchResultClicked={() => {
				searchFieldValue = '';
				results = [];
			}}
			{results}
		/>
	</div>
{/if}
