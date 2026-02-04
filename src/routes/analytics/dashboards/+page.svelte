<script lang="ts">
	import { goto } from '$app/navigation';
	import { dashboardsStore } from '$lib/stores/dashboards.svelte';
	import type { Dashboard, DataTableColumn } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import { Plus, Eye } from 'lucide-svelte';

	let searchTerm = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		dashboardsStore.load();
	});

	const filteredDashboards = $derived(() => {
		let data = dashboardsStore.items;

		// Search
		data = searchItems(data, searchTerm, ['name']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedDashboards = $derived(() => {
		return paginate(filteredDashboards, currentPage, itemsPerPage);
	});

	const totalPages = $derived(() => {
		return Math.ceil(filteredDashboards.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleRowClick(row: Dashboard) {
		goto(`/analytics/dashboards/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'name', label: 'Dashboard Name' },
		{ key: 'isPublic', label: 'Public', render: (row: Dashboard) => (row.isPublic ? 'Yes' : 'No') },
		{ key: 'createdAt', label: 'Created At', render: (row: Dashboard) => formatters.dateTime(row.createdAt) },
		{
			key: 'actions',
			label: 'Actions',
			render: (row: Dashboard) => `
				<div class="flex justify-center">
					<a href="/analytics/dashboards/${row.id}" class="btn btn-sm btn-ghost" title="View Dashboard" data-action="view">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
					</a>
				</div>
			`
		}
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Dashboards</h1>
		<Button onclick={() => goto('/analytics/dashboards/new')}>
			<Plus size={16} class="mr-1" /> New Dashboard
		</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search dashboards..." />
			</div>
		</div>
		<DataTable data={paginatedDashboards} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
