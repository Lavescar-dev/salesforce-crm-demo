<script lang="ts">
	import { goto } from '$app/navigation';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import type { Contact, DataTableColumn } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';

	let searchTerm = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		contactsStore.load();
	});

	const filteredContacts = $derived.by(() => {
		let data = contactsStore.items;

		// Search
		data = searchItems(data, searchTerm, ['firstName', 'lastName', 'email', 'phone', 'title', 'accountName']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedContacts = $derived.by(() => {
		return paginate(filteredContacts, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredContacts.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleRowClick(row: Contact) {
		goto(`/sales/contacts/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'firstName', label: 'First Name' },
		{ key: 'lastName', label: 'Last Name' },
		{ key: 'accountName', label: 'Account' },
		{ key: 'title', label: 'Title' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone', render: (value: string, row: Contact) => formatters.phone(value) }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Contacts</h1>
		<Button onclick={() => goto('/sales/contacts/new')}>New Contact</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search contacts..." />
			</div>
		</div>
		<DataTable data={paginatedContacts} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
