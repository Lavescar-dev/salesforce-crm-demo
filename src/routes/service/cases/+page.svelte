<script lang="ts">
	import { goto } from '$app/navigation';
	import { casesStore } from '$lib/stores/cases.svelte';
	import type { Case, DataTableColumn, SelectOption } from '$lib/types';
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
	let priorityFilter = $state('All');
	let typeFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		casesStore.load();
	});

	const filteredCases = $derived.by(() => {
		let data = casesStore.items;

		// Filter by status
		if (statusFilter !== 'All') {
			data = data.filter((caseItem) => caseItem.status === statusFilter);
		}
		// Filter by priority
		if (priorityFilter !== 'All') {
			data = data.filter((caseItem) => caseItem.priority === priorityFilter);
		}
		// Filter by type
		if (typeFilter !== 'All') {
			data = data.filter((caseItem) => caseItem.type === typeFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['caseNumber', 'subject', 'description', 'status', 'priority', 'type']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedCases = $derived.by(() => {
		return paginate(filteredCases, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredCases.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleStatusChange(value: string) {
		statusFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handlePriorityChange(value: string) {
		priorityFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleTypeChange(value: string) {
		typeFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleRowClick(row: Case) {
		goto(`/service/cases/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'caseNumber', label: 'Case Number' },
		{ key: 'subject', label: 'Subject' },
		{
			key: 'status',
			label: 'Status',
			render: (value: CaseStatus, row: Case) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
				switch (value) {
					case 'New':
						variant = 'blue';
						break;
					case 'Working':
						variant = 'yellow';
						break;
					case 'Closed':
						variant = 'green';
						break;
					case 'Escalated':
						variant = 'red';
						break;
					case 'On Hold':
						variant = 'gray';
						break;
				}
				return `
					<div class="flex justify-center">
						<span class="badge badge-${variant}">${value}</span>
					</div>
				`;
			}
		},
		{
			key: 'priority',
			label: 'Priority',
			render: (value: CasePriority, row: Case) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
				switch (value) {
					case 'Low':
						variant = 'green';
						break;
					case 'Medium':
						variant = 'yellow';
						break;
					case 'High':
						variant = 'orange'; // Assuming orange for high
						break;
					case 'Critical':
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
		{ key: 'type', label: 'Type' },
		{ key: 'origin', label: 'Origin' },
		{ key: 'createdAt', label: 'Created At', render: (value: string, row: Case) => formatters.dateTime(value) }
	];

	const statusOptions: SelectOption[] = [
		{ value: 'All', label: 'All Statuses' },
		{ value: 'New', label: 'New' },
		{ value: 'Working', label: 'Working' },
		{ value: 'Escalated', label: 'Escalated' },
		{ value: 'On Hold', label: 'On Hold' },
		{ value: 'Closed', label: 'Closed' }
	];

	const priorityOptions: SelectOption[] = [
		{ value: 'All', label: 'All Priorities' },
		{ value: 'Low', label: 'Low' },
		{ value: 'Medium', label: 'Medium' },
		{ value: 'High', label: 'High' },
		{ value: 'Critical', label: 'Critical' }
	];

	const typeOptions: SelectOption[] = [
		{ value: 'All', label: 'All Types' },
		{ value: 'Question', label: 'Question' },
		{ value: 'Problem', label: 'Problem' },
		{ value: 'Feature Request', label: 'Feature Request' },
		{ value: 'Other', label: 'Other' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Cases</h1>
		<Button onclick={() => goto('/service/cases/new')}>New Case</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search cases..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={statusOptions} bind:value={statusFilter} onchange={(e) => handleStatusChange((e.target as HTMLSelectElement).value)} />
			</div>
			<div class="w-full md:w-auto">
				<Select options={priorityOptions} bind:value={priorityFilter} onchange={(e) => handlePriorityChange((e.target as HTMLSelectElement).value)} />
			</div>
			<div class="w-full md:w-auto">
				<Select options={typeOptions} bind:value={typeFilter} onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedCases} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
