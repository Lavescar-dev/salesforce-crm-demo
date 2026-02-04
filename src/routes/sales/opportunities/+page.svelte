<script lang="ts">
	import { goto } from '$app/navigation';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import type { Opportunity, DataTableColumn, SelectOption } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let searchTerm = $state('');
	let statusFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		opportunitiesStore.load();
		accountsStore.load(); // Load accounts for linking
	});

	const filteredOpportunities = $derived.by(() => {
		let data = opportunitiesStore.items;

		// Filter by status
		if (statusFilter !== 'All') {
			data = data.filter((opportunity) => opportunity.stage === statusFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['name', 'accountName', 'stage', 'type']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedOpportunities = $derived.by(() => {
		return paginate(filteredOpportunities, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredOpportunities.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleStatusChange(value: string) {
		statusFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handleRowClick(row: Opportunity) {
		goto(`/sales/opportunities/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'name', label: 'Opportunity Name' },
		{ key: 'accountName', label: 'Account' },
		{
			key: 'stage',
			label: 'Stage',
			render: (value: OpportunityStage, row: Opportunity) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
				switch (value) {
					case 'Prospecting':
						variant = 'blue';
						break;
					case 'Qualification':
						variant = 'yellow';
						break;
					case 'Needs Analysis':
						variant = 'yellow';
						break;
					case 'Value Proposition':
						variant = 'yellow';
						break;
					case 'Perception Analysis':
						variant = 'yellow';
						break;
					case 'Proposal/Price Quote':
						variant = 'blue';
						break;
					case 'Negotiation/Review':
						variant = 'blue';
						break;
					case 'Closed Won':
						variant = 'green';
						break;
					case 'Closed Lost':
						variant = 'red';
						break;
				}
				return `
					<div class="flex justify-center">
						<span class="badge badge-${variant}">${value}</span>
					</div>
				`;
			}
		},
		{ key: 'amount', label: 'Amount', render: (value: number, row: Opportunity) => formatters.currency(value) },
		{ key: 'closeDate', label: 'Close Date', render: (value: string, row: Opportunity) => formatters.date(value) }
	];

	const statusOptions: SelectOption[] = [
		{ value: 'All', label: 'All Stages' },
		{ value: 'Prospecting', label: 'Prospecting' },
		{ value: 'Qualification', label: 'Qualification' },
		{ value: 'Needs Analysis', label: 'Needs Analysis' },
		{ value: 'Value Proposition', label: 'Value Proposition' },
		{ value: 'Perception Analysis', label: 'Perception Analysis' },
		{ value: 'Proposal/Price Quote', label: 'Proposal/Price Quote' },
		{ value: 'Negotiation/Review', label: 'Negotiation/Review' },
		{ value: 'Closed Won', label: 'Closed Won' },
		{ value: 'Closed Lost', label: 'Closed Lost' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Opportunities</h1>
		<Button onclick={() => goto('/sales/opportunities/new')}>New Opportunity</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search opportunities..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={statusOptions} bind:value={statusFilter} onchange={(e) => handleStatusChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedOpportunities} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
