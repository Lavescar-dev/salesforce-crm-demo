<script lang="ts">
	import { goto } from '$app/navigation';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import type { Campaign, DataTableColumn, SelectOption } from '$lib/types';
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
	let statusFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		campaignsStore.load();
	});

	const filteredCampaigns = $derived.by(() => {
		let data = campaignsStore.items;

		// Filter by type
		if (typeFilter !== 'All') {
			data = data.filter((campaign) => campaign.type === typeFilter);
		}
		// Filter by status
		if (statusFilter !== 'All') {
			data = data.filter((campaign) => campaign.status === statusFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['name', 'type', 'status']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedCampaigns = $derived.by(() => {
		return paginate(filteredCampaigns, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredCampaigns.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleTypeChange(value: string) {
		typeFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleStatusChange(value: string) {
		statusFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleRowClick(row: Campaign) {
		goto(`/marketing/campaigns/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'name', label: 'Campaign Name' },
		{ key: 'type', label: 'Type' },
				{ key: 'status',
					label: 'Status',
					render: (value: CampaignStatus, row: Campaign) => {
						let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
						switch (value) {
							case 'Planned':
								variant = 'blue';
								break;
							case 'In Progress':
								variant = 'yellow';
								break;
							case 'Completed':
								variant = 'green';
								break;
							case 'Aborted':
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
				{ key: 'budgetedCost', label: 'Budget', render: (value: number, row: Campaign) => formatters.currency(value) },
				{ key: 'actualCost', label: 'Actual Cost', render: (value: number, row: Campaign) => formatters.currency(value) },
				{ key: 'expectedRevenue', label: 'Expected Revenue', render: (value: number, row: Campaign) => formatters.currency(value) },
		{ key: 'startDate', label: 'Start Date', render: (value: string, row: Campaign) => formatters.date(value) },
		{ key: 'endDate', label: 'End Date', render: (value: string, row: Campaign) => formatters.date(value) }
	];

	const typeOptions: SelectOption[] = [
		{ value: 'All', label: 'All Types' },
		{ value: 'Email', label: 'Email' },
		{ value: 'Webinar', label: 'Webinar' },
		{ value: 'Conference', label: 'Conference' },
		{ value: 'Trade Show', label: 'Trade Show' },
		{ value: 'Direct Mail', label: 'Direct Mail' },
		{ value: 'Other', label: 'Other' }
	];

	const statusOptions: SelectOption[] = [
		{ value: 'All', label: 'All Statuses' },
		{ value: 'Planned', label: 'Planned' },
		{ value: 'In Progress', label: 'In Progress' },
		{ value: 'Completed', label: 'Completed' },
		{ value: 'Aborted', label: 'Aborted' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Campaigns</h1>
		<Button onclick={() => goto('/marketing/campaigns/new')}>New Campaign</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search campaigns..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={typeOptions} bind:value={typeFilter} onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value)} />
			</div>
			<div class="w-full md:w-auto">
				<Select options={statusOptions} bind:value={statusFilter} onchange={(e) => handleStatusChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedCampaigns} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
