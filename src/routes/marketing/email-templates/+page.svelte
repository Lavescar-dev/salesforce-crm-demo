<script lang="ts">
	import { goto } from '$app/navigation';
	import { emailTemplatesStore } from '$lib/stores/emailTemplates.svelte';
	import type { EmailTemplate, DataTableColumn, SelectOption } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let searchTerm = $state('');
	let categoryFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		emailTemplatesStore.load();
	});

	const filteredTemplates = $derived(() => {
		let data = emailTemplatesStore.items;

		// Filter by category
		if (categoryFilter !== 'All') {
			data = data.filter((template) => template.category === categoryFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['name', 'subject', 'category']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedTemplates = $derived(() => {
		return paginate(filteredTemplates, currentPage, itemsPerPage);
	});

	const totalPages = $derived(() => {
		return Math.ceil(filteredTemplates.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleCategoryChange(value: string) {
		categoryFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleRowClick(row: EmailTemplate) {
		goto(`/marketing/email-templates/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'name', label: 'Template Name' },
		{ key: 'subject', label: 'Subject' },
		{ key: 'category', label: 'Category' },
		{ key: 'createdAt', label: 'Created At', render: (row: EmailTemplate) => formatters.dateTime(row.createdAt) }
	];

	const categoryOptions: SelectOption[] = [
		{ value: 'All', label: 'All Categories' },
		{ value: 'Promotional', label: 'Promotional' },
		{ value: 'Transactional', label: 'Transactional' },
		{ value: 'Welcome', label: 'Welcome' },
		{ value: 'Newsletter', label: 'Newsletter' },
		{ value: 'Follow-up', label: 'Follow-up' },
		{ value: 'Other', label: 'Other' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Email Templates</h1>
		<Button onclick={() => goto('/marketing/email-templates/new')}>New Template</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search templates..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={categoryOptions} bind:value={categoryFilter} onchange={(e) => handleCategoryChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedTemplates} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
