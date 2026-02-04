<script lang="ts">
	import { goto } from '$app/navigation';
	import { leadsStore } from '$lib/stores/leads.svelte';
	import type { Lead, DataTableColumn } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { Plus } from 'lucide-svelte';

	let searchTerm = $state('');
	let statusFilter = $state('');
	let sortField = $state('createdAt');
	let sortDirection = $state<'asc' | 'desc'>('desc');
	let currentPage = $state(1);
	const pageSize = 10;

	const statusOptions = [
		{ value: '', label: 'All Statuses' },
		{ value: 'New', label: 'New' },
		{ value: 'Working', label: 'Working' },
		{ value: 'Nurturing', label: 'Nurturing' },
		{ value: 'Qualified', label: 'Qualified' },
		{ value: 'Unqualified', label: 'Unqualified' }
	];

	const statusBadgeVariant = (status: Lead['status']) => {
		const variants: Record<Lead['status'], any> = {
			New: 'blue',
			Working: 'yellow',
			Nurturing: 'gray',
			Qualified: 'green',
			Unqualified: 'red'
		};
		return variants[status] || 'gray';
	};

	const columns: DataTableColumn[] = [
		{
			key: 'firstName',
			label: 'Name',
			sortable: true,
			render: (_, row: Lead) => `${row.firstName} ${row.lastName}`
		},
		{
			key: 'company',
			label: 'Company',
			sortable: true
		},
		{
			key: 'email',
			label: 'Email',
			sortable: true
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			render: (value: Lead['status']) =>
				`<span class="badge badge-${statusBadgeVariant(value)}">${value}</span>`
		},
		{
			key: 'rating',
			label: 'Rating',
			sortable: true
		},
		{
			key: 'createdAt',
			label: 'Created',
			sortable: true,
			render: (value: string) => formatters.date(value)
		}
	];

	const filteredAndSortedLeads = $derived.by(() => {
		let result = leadsStore.items;

		// Filter by status
		if (statusFilter) {
			result = result.filter((lead) => lead.status === statusFilter);
		}

		// Search
		if (searchTerm) {
			result = searchItems(result, searchTerm, ['firstName', 'lastName', 'company', 'email']);
		}

		// Sort
		result = sortBy(result, sortField as keyof Lead, sortDirection);

		return result;
	});

	const paginatedData = $derived.by(() => {
		return paginate(filteredAndSortedLeads, currentPage, pageSize);
	});

	function handleSort(field: string) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1;
	}

	function handleStatusFilter(e: Event) {
		const target = e.target as HTMLSelectElement;
		statusFilter = target.value;
		currentPage = 1;
	}

	function handleRowClick(lead: Lead) {
		goto(`/sales/leads/${lead.id}`);
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}
</script>

<div class="max-w-7xl mx-auto">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-salesforce-gray-900">Leads</h1>
			<p class="text-salesforce-gray-600 mt-1">
				Manage and track your sales leads
			</p>
		</div>
		<Button variant="primary" onclick={() => goto('/sales/leads/new')}>
			<Plus size={20} />
			New Lead
		</Button>
	</div>

	<Card>
		<div class="p-4 border-b border-salesforce-gray-200">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search leads..." />
				<Select
					bind:value={statusFilter}
					options={statusOptions}
					onchange={handleStatusFilter}
				/>
			</div>
		</div>

		<DataTable
			data={paginatedData.items}
			{columns}
			{sortField}
			{sortDirection}
			onSort={handleSort}
			onRowClick={handleRowClick}
		/>

		{#if paginatedData.totalPages > 1}
			<Pagination
				currentPage={paginatedData.currentPage}
				totalPages={paginatedData.totalPages}
				onPageChange={handlePageChange}
			/>
		{/if}
	</Card>
</div>
