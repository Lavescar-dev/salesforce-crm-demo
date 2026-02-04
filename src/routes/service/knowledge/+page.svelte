<script lang="ts">
	import { goto } from '$app/navigation';
	import { knowledgeArticlesStore } from '$lib/stores/knowledgeArticles.svelte';
	import type { KnowledgeArticle, DataTableColumn, SelectOption } from '$lib/types';
	import { formatters, sortBy, searchItems, paginate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Pagination from '$lib/components/data/Pagination.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let searchTerm = $state('');
	let categoryFilter = $state('All');
	let statusFilter = $state('All');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Load data on component mount
	$effect(() => {
		knowledgeArticlesStore.load();
	});

	const filteredArticles = $derived.by(() => {
		let data = knowledgeArticlesStore.items;

		// Filter by category
		if (categoryFilter !== 'All') {
			data = data.filter((article) => article.category === categoryFilter);
		}
		// Filter by status
		if (statusFilter !== 'All') {
			data = data.filter((article) => article.status === statusFilter);
		}

		// Search
		data = searchItems(data, searchTerm, ['title', 'summary', 'content', 'tags']);

		// Sort
		data = sortBy(data, 'createdAt', 'desc');

		return data;
	});

	const paginatedArticles = $derived.by(() => {
		return paginate(filteredArticles, currentPage, itemsPerPage);
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(filteredArticles.length / itemsPerPage);
	});

	function handleSearch(value: string) {
		searchTerm = value;
		currentPage = 1; // Reset to first page on search
	}

	function handleCategoryChange(value: string) {
		categoryFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleStatusChange(value: string) {
		statusFilter = value;
		currentPage = 1; // Reset to first page on filter change
	}

	function handleRowClick(row: KnowledgeArticle) {
		goto(`/service/knowledge/${row.id}`);
	}

	const columns: DataTableColumn[] = [
		{ key: 'title', label: 'Title' },
		{ key: 'category', label: 'Category' },
		{
			key: 'status',
			label: 'Status',
			render: (value: ArticleStatus, row: KnowledgeArticle) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
				switch (value) {
					case 'Published':
						variant = 'green';
						break;
					case 'Draft':
						variant = 'yellow';
						break;
					case 'Archived':
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
		{ key: 'viewCount', label: 'Views', render: (value: number, row: KnowledgeArticle) => formatters.number(value) },
		{ key: 'helpfulCount', label: 'Helpful', render: (value: number, row: KnowledgeArticle) => formatters.number(value) }
	];

	const categoryOptions: SelectOption[] = [
		{ value: 'All', label: 'All Categories' },
		{ value: 'Getting Started', label: 'Getting Started' },
		{ value: 'Troubleshooting', label: 'Troubleshooting' },
		{ value: 'How To', label: 'How To' },
		{ value: 'FAQ', label: 'FAQ' },
		{ value: 'Best Practices', label: 'Best Practices' },
		{ value: 'Other', label: 'Other' }
	];

	const statusOptions: SelectOption[] = [
		{ value: 'All', label: 'All Statuses' },
		{ value: 'Draft', label: 'Draft' },
		{ value: 'Published', label: 'Published' },
		{ value: 'Archived', label: 'Archived' }
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Knowledge Base</h1>
		<Button onclick={() => goto('/service/knowledge/new')}>New Article</Button>
	</div>

	<Card class="p-4">
		<div class="flex flex-col md:flex-row gap-4 mb-4">
			<div class="flex-grow">
				<SearchBar bind:value={searchTerm} onSearch={handleSearch} placeholder="Search articles..." />
			</div>
			<div class="w-full md:w-auto">
				<Select options={categoryOptions} bind:value={categoryFilter} onchange={(e) => handleCategoryChange((e.target as HTMLSelectElement).value)} />
			</div>
			<div class="w-full md:w-auto">
				<Select options={statusOptions} bind:value={statusFilter} onchange={(e) => handleStatusChange((e.target as HTMLSelectElement).value)} />
			</div>
		</div>
		<DataTable data={paginatedArticles} {columns} onRowClick={handleRowClick} />
		<div class="mt-4 flex justify-end">
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>
	</Card>
</div>
