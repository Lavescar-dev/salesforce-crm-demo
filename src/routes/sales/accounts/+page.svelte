<script lang="ts">
	import { goto } from '$app/navigation';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import type { Account, DataTableColumn, SelectOption } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let searchTerm = $state('');
	let typeFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		accountsStore.load();
	});

	const filteredAccounts = $derived.by(() => {
		let data = accountsStore.items;

		// Filter by type
		if (typeFilter !== 'All') {
			data = data.filter((account) => account.type === typeFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['name', 'industry', 'type']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedAccounts = $derived.by(() => {
		return paginate(filteredAccounts, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredAccounts.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleTypeChange(value: string) {
		typeFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleRowClick(row: Account) {
		goto(`/sales/accounts/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'name', label: 'Account Name' },
		{ key: 'type', label: 'Type' },
		{ key: 'industry', label: 'Industry' },
		{ key: 'annualRevenue', label: 'Annual Revenue', render: (row: Account) => formatters.currency(row.annualRevenue) },
		{ key: 'numberOfEmployees', label: 'Employees', render: (row: Account) => formatters.number(row.numberOfEmployees) }
	];

	const typeOptions: SelectOption[] = [
		{ value: 'All', label: 'All Types' },
		{ value: 'Customer', label: 'Customer' },
		{ value: 'Prospect', label: 'Prospect' },
		{ value: 'Partner', label: 'Partner' },
		{ value: 'Reseller', label: 'Reseller' },
		{ value: 'Other', label: 'Other' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Accounts</h1>
		<Button onclick={() => goto('/sales/accounts/new')}>New Account</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search accounts..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={typeOptions} bind:value={typeFilter} onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedAccounts} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
