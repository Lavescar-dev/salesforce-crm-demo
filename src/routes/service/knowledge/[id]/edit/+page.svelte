<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import RichTextEditor from '$lib/components/forms/RichTextEditor.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { knowledgeArticlesStore } from '$lib/stores/knowledgeArticles.svelte';
	import type { KnowledgeArticle, SelectOption } from '$lib/types';

	const articleId = $page.params.id;
	let existingArticle = knowledgeArticlesStore.getById(articleId);

	if (!existingArticle) {
		toastStore.error('Knowledge Article not found!');
		goto('/service/knowledge');
	}

	let formData = $state({
		title: existingArticle?.title || '',
		summary: existingArticle?.summary || '',
		content: existingArticle?.content || '',
		status: existingArticle?.status || 'Draft',
		category: existingArticle?.category || 'Getting Started',
		tags: existingArticle?.tags.join(', ') || '' // Convert array to comma-separated string
	});

	let formErrors = $state({
		title: '',
		content: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			title: '',
			content: ''
		};

		if (!formData.title) {
			errors.title = 'Title is required.';
			isValid = false;
		}
		if (!formData.content) {
			errors.content = 'Content is required.';
			isValid = false;
		}

		formErrors = errors;
		return isValid;
	}

	const statusOptions: SelectOption[] = [
		{ value: 'Draft', label: 'Draft' },
		{ value: 'Published', label: 'Published' },
		{ value: 'Archived', label: 'Archived' }
	];

	const categoryOptions: SelectOption[] = [
		{ value: 'Getting Started', label: 'Getting Started' },
		{ value: 'Troubleshooting', label: 'Troubleshooting' },
		{ value: 'How To', label: 'How To' },
		{ value: 'FAQ', label: 'FAQ' },
		{ value: 'Best Practices', label: 'Best Practices' },
		{ value: 'Other', label: 'Other' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		if (!articleId) {
			toastStore.error('Article ID is missing.');
			return;
		}

		try {
			const updatedArticle = knowledgeArticlesStore.update(articleId, {
				title: formData.title,
				summary: formData.summary,
				content: formData.content,
				status: formData.status,
				category: formData.category,
				tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
				// viewCount, helpfulCount, notHelpfulCount are updated on the view page
			});

			if (updatedArticle) {
				toastStore.success('Knowledge article updated successfully!');
				goto(`/service/knowledge/${updatedArticle.id}`);
			} else {
				toastStore.error('Failed to update article: Article not found.');
			}
		} catch (error) {
			console.error('Error updating article:', error);
			toastStore.error('Failed to update article.');
		}
	}

	function handleCancel() {
		goto(`/service/knowledge/${articleId}`);
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Knowledge Article</h1>
		<p class="text-salesforce-gray-600 mt-1">Update knowledge article information</p>
	</div>

	<Card class="p-6">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="title" class="form-label">Title *</label>
				<Input id="title" bind:value={formData.title} required class={formErrors.title ? 'border-red-500' : ''} />
				{#if formErrors.title}
					<p class="text-red-500 text-sm mt-1">{formErrors.title}</p>
				{/if}
			</div>
			<div>
				<label for="summary" class="form-label">Summary</label>
				<Textarea id="summary" bind:value={formData.summary} rows={2} />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="status" class="form-label">Status</label>
					<Select id="status" bind:value={formData.status} options={statusOptions} />
				</div>
				<div>
					<label for="category" class="form-label">Category</label>
					<Select id="category" bind:value={formData.category} options={categoryOptions} />
				</div>
			</div>
			<div>
				<label for="tags" class="form-label">Tags (comma-separated)</label>
				<Input id="tags" bind:value={formData.tags} placeholder="e.g. setup, installation, faq" />
			</div>
			<div>
				<label for="content" class="form-label">Content *</label>
				<RichTextEditor id="content" bind:value={formData.content} required />
				{#if formErrors.content}
					<p class="text-red-500 text-sm mt-1">{formErrors.content}</p>
				{/if}
			</div>

			<div class="flex gap-3 justify-end">
				<Button type="button" variant="secondary" onclick={handleCancel}>Cancel</Button>
				<Button type="submit" variant="primary">Update Article</Button>
			</div>
		</form>
	</Card>
</div>
