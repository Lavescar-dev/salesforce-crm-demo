<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { emailTemplatesStore } from '$lib/stores/emailTemplates.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { EmailTemplate } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { Edit, Trash2, ArrowLeft } from 'lucide-svelte';

	const templateId = $derived($page.params.id);
	const template = $derived(emailTemplatesStore.getById(templateId));

	let showDeleteModal = $state(false);

	function handleEdit() {
		goto(`/marketing/email-templates/${templateId}/edit`);
	}

	function handleDelete() {
		if (emailTemplatesStore.delete(templateId)) {
			toastStore.success('Email template deleted successfully!');
			goto('/marketing/email-templates');
		} else {
			toastStore.error('Failed to delete email template');
		}
	}
</script>

{#if !template}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Email Template not found</p>
			<Button variant="secondary" onclick={() => goto('/marketing/email-templates')} class="mt-4">
				Back to Email Templates
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/marketing/email-templates')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Email Templates
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{template.name}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Category: {template.category}</p>
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
			<!-- Template Details -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Template Details</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Template Name</p>
						<p class="font-medium">{template.name}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Subject</p>
						<p class="font-medium">{template.subject}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Category</p>
						<p class="font-medium">{template.category}</p>
					</div>
				</div>
			</Card>

			<!-- Template Preview -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Preview</h2>
				<div class="border border-salesforce-gray-200 rounded-lg p-4 bg-white">
					{@html template.htmlBody}
				</div>
			</Card>

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(template.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(template.updatedAt)}</p>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Email Template" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this email template? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>
{/if}
