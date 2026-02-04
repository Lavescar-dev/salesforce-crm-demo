<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { knowledgeArticlesStore } from '$lib/stores/knowledgeArticles.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { KnowledgeArticle } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { Edit, Trash2, ArrowLeft, ThumbsUp, ThumbsDown, Eye } from 'lucide-svelte';

	const articleId = $derived($page.params.id);
	const article = $derived(knowledgeArticlesStore.getById(articleId));

	let showDeleteModal = $state(false);

	const statusBadgeVariant = $derived(() => {
		if (!article) return 'gray';
		switch (article.status) {
			case 'Published':
				return 'green';
			case 'Draft':
				return 'yellow';
			case 'Archived':
				return 'gray';
			default:
				return 'gray';
		}
	});

	// Increment view count on load (client-side only)
	$effect(() => {
		if (article) {
			knowledgeArticlesStore.update(article.id, { viewCount: article.viewCount + 1 });
		}
	});

	function handleHelpful(isHelpful: boolean) {
		if (!article) return;
		if (isHelpful) {
			knowledgeArticlesStore.update(article.id, { helpfulCount: article.helpfulCount + 1 });
			toastStore.success('Marked as helpful!');
		} else {
			knowledgeArticlesStore.update(article.id, { notHelpfulCount: article.notHelpfulCount + 1 });
			toastStore.info('Marked as not helpful.');
		}
	}

	function handleEdit() {
		goto(`/service/knowledge/${articleId}/edit`);
	}

	function handleDelete() {
		if (knowledgeArticlesStore.delete(articleId)) {
			toastStore.success('Article deleted successfully!');
			goto('/service/knowledge');
		} else {
			toastStore.error('Failed to delete article');
		}
	}
</script>

{#if !article}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Knowledge Article not found</p>
			<Button variant="secondary" onclick={() => goto('/service/knowledge')} class="mt-4">
				Back to Knowledge Base
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/service/knowledge')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Knowledge Base
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{article.title}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Category: {article.category}</p>
				</div>
				<div class="flex gap-2">
					<Button variant="secondary" onclick={handleEdit}>
						<Edit size={16} />
						Edit
					</Button>
					<Button variant="destructive" onclick={() => (showDeleteModal = true)}>
						<Trash2 size={16} />
						Delete
					</Button>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<!-- Article Details -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Article Details</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Title</p>
						<p class="font-medium">{article.title}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Category</p>
						<p class="font-medium">{article.category}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Status</p>
						<Badge variant={statusBadgeVariant()}>{article.status}</Badge>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Views</p>
						<p class="font-medium flex items-center gap-1">
							<Eye size={16} /> {formatters.number(article.viewCount)}
						</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Tags</p>
						<div class="flex flex-wrap gap-1">
							{#each article.tags as tag}
								<Badge variant="blue">{tag}</Badge>
							{/each}
						</div>
					</div>
				</div>
				<div class="mt-4">
					<p class="text-sm text-salesforce-gray-600">Summary</p>
					<p class="font-medium whitespace-pre-wrap">{article.summary}</p>
				</div>
			</Card>

			<!-- Article Content -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Content</h2>
				<div class="prose max-w-none">
					{@html article.content}
				</div>
			</Card>

			<!-- Helpfulness Rating -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Was this article helpful?</h2>
				<div class="flex gap-4 items-center">
					<Button variant="secondary" onclick={() => handleHelpful(true)}>
						<ThumbsUp size={16} class="mr-1" /> Yes ({formatters.number(article.helpfulCount)})
					</Button>
					<Button variant="secondary" onclick={() => handleHelpful(false)}>
						<ThumbsDown size={16} class="mr-1" /> No ({formatters.number(article.notHelpfulCount)})
					</Button>
				</div>
			</Card>

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(article.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(article.updatedAt)}</p>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Article" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this knowledge article? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>
{/if}
