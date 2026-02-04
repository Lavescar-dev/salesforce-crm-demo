<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { casesStore } from '$lib/stores/cases.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { activitiesStore } from '$lib/stores/activities.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { Case } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ActivityLog from '$lib/components/sales/ActivityLog.svelte';
	import ActivityForm from '$lib/components/sales/ActivityForm.svelte';
	import CaseTimeline from '$lib/components/service/CaseTimeline.svelte';
	import { Edit, Trash2, ArrowLeft, Plus, MessageSquareText, Lightbulb } from 'lucide-svelte';
	import { knowledgeArticlesStore } from '$lib/stores/knowledgeArticles.svelte';
	import { caseTimelineEventsStore } from '$lib/stores/caseTimelineEvents.svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	const caseId = $derived($page.params.id);
	const caseItem = $derived(casesStore.getById(caseId)); // Renamed to caseItem to avoid conflict with 'case' keyword

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);
	let showCommentModal = $state(false);
	let newCommentBody = $state('');

	$effect(() => {
		casesStore.load();
		accountsStore.load(); // Load accounts for contact linking
		contactsStore.load(); // Load contacts for case linking
		activitiesStore.load(); // Load activities for case activities
		knowledgeArticlesStore.load(); // Load knowledge articles for suggestions
		caseTimelineEventsStore.load(); // Load case timeline events
	});

	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === caseId));

	const suggestedArticles = $derived(() => {
		if (!caseItem) return [];
		const keywords = new Set([...caseItem.subject.toLowerCase().split(' '), ...caseItem.description.toLowerCase().split(' ')].filter(Boolean));
		return knowledgeArticlesStore.items.filter(article => {
			const articleText = `${article.title} ${article.summary} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
			return Array.from(keywords).some(keyword => articleText.includes(keyword));
		}).slice(0, 5); // Limit to 5 suggestions
	});

	const caseTimelineEvents = $derived(() => caseTimelineEventsStore.getByCaseId(caseId));

	const statusBadgeVariant = $derived(() => {
		if (!caseItem) return 'gray';
		switch (caseItem.status) {
			case 'New':
				return 'blue';
			case 'Working':
				return 'yellow';
			case 'Escalated':
				return 'red';
			case 'On Hold':
				return 'gray';
			case 'Closed':
				return 'green';
			default:
				return 'gray';
		}
	});

	const priorityBadgeVariant = $derived(() => {
		if (!caseItem) return 'gray';
		switch (caseItem.priority) {
			case 'Low':
				return 'green';
			case 'Medium':
				return 'yellow';
			case 'High':
				return 'orange'; // Assuming orange for high
			case 'Critical':
				return 'red';
			default:
				return 'gray';
		}
	});

	function handleEdit() {
		goto(`/service/cases/${caseId}/edit`);
	}

	function handleDelete() {
		if (casesStore.delete(caseId)) {
			toastStore.success('Case deleted successfully!');
			goto('/service/cases');
		} else {
			toastStore.error('Failed to delete case');
		}
	}

	function handleAddComment() {
		if (!caseItem || !newCommentBody.trim()) {
			toastStore.error('Comment cannot be empty.');
			return;
		}

		try {
			caseTimelineEventsStore.create({
				caseId: caseId,
				type: 'Comment',
				title: 'New Comment Added',
				description: newCommentBody,
				createdById: authStore.user?.id
			});
			toastStore.success('Comment added successfully!');
			newCommentBody = '';
			showCommentModal = false;
		} catch (error) {
			console.error('Error adding comment:', error);
			toastStore.error('Failed to add comment.');
		}
	}
</script>

{#if !caseItem}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Case not found</p>
			<Button variant="secondary" onclick={() => goto('/service/cases')} class="mt-4">
				Back to Cases
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/service/cases')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Cases
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{caseItem.subject}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Case #{caseItem.caseNumber}</p>
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

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 space-y-6">
				<!-- Case Details -->
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Case Details</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-salesforce-gray-600">Subject</p>
							<p class="font-medium">{caseItem.subject}</p>
						</div>
						<div>
							<p class="text-sm text-salesforce-gray-600">Case Number</p>
							<p class="font-medium">{caseItem.caseNumber}</p>
						</div>
						<div>
							<p class="text-sm text-salesforce-gray-600">Status</p>
							<Badge variant={statusBadgeVariant()}>{caseItem.status}</Badge>
						</div>
						<div>
							<p class="text-sm text-salesforce-gray-600">Priority</p>
							<Badge variant={priorityBadgeVariant()}>{caseItem.priority}</Badge>
						</div>
						<div>
							<p class="text-sm text-salesforce-gray-600">Type</p>
							<p class="font-medium">{caseItem.type}</p>
						</div>
						<div>
							<p class="text-sm text-salesforce-gray-600">Origin</p>
							<p class="font-medium">{caseItem.origin}</p>
						</div>
						{#if caseItem.contactId}
							<div>
								<p class="text-sm text-salesforce-gray-600">Contact</p>
								<a
									href="/sales/contacts/{caseItem.contactId}"
									class="font-medium text-salesforce-blue-500 hover:underline"
									>{contactsStore.getById(caseItem.contactId)?.firstName} {contactsStore.getById(caseItem.contactId)?.lastName}</a
								>
							</div>
						{/if}
						{#if caseItem.accountId}
							<div>
								<p class="text-sm text-salesforce-gray-600">Account</p>
								<a
									href="/sales/accounts/{caseItem.accountId}"
									class="font-medium text-salesforce-blue-500 hover:underline"
									>{accountsStore.getById(caseItem.accountId)?.name}</a
								>
							</div>
						{/if}
					</div>
					{#if caseItem.description}
						<div class="mt-4">
							<p class="text-sm text-salesforce-gray-600">Description</p>
							<p class="font-medium whitespace-pre-wrap">{caseItem.description}</p>
						</div>
					{/if}
				</Card>

				<!-- Activities -->
				<Card class="p-6">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-lg font-semibold text-salesforce-gray-900">Activities</h2>
						<Button size="sm" variant="secondary" onclick={() => (showActivityModal = true)}>
							<Plus size={16} class="mr-1" /> Log Activity
						</Button>
					</div>
					<ActivityLog activities={relatedActivities} />
				</Card>
			</div>

			<div class="lg:col-span-1 space-y-6">
				<!-- Suggested Knowledge Articles -->
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">
						<Lightbulb size={20} class="inline mr-2 text-salesforce-yellow-500" />Suggested Articles
					</h2>
					{#if suggestedArticles.length > 0}
						<ul class="space-y-3">
							{#each suggestedArticles as article (article.id)}
								<li>
									<a href="/service/knowledge/{article.id}" class="text-salesforce-blue-500 hover:underline font-medium">
										{article.title}
									</a>
									<p class="text-sm text-salesforce-gray-600 line-clamp-2">{article.summary}</p>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-salesforce-gray-600 text-sm">No relevant articles found.</p>
					{/if}
				</Card>

				<!-- Case Timeline -->
				<Card class="p-6">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-lg font-semibold text-salesforce-gray-900">Timeline</h2>
						<Button size="sm" variant="secondary" onclick={() => (showCommentModal = true)}>
							<MessageSquareText size={16} class="mr-1" /> Add Comment
						</Button>
					</div>
					<CaseTimeline timelineEvents={caseTimelineEvents} />
				</Card>
			</div>
		</div>
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Case" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this case? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Case" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={caseId}
			relatedToType="Case"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>

	<Modal isOpen={showCommentModal} title="Add Case Comment" onClose={() => (showCommentModal = false)}>
		<form onsubmit={handleAddComment}>
			<Textarea bind:value={newCommentBody} placeholder="Enter your comment..." rows={4} class="mb-4" />
			<div class="flex gap-3 justify-end">
				<Button type="button" variant="secondary" onclick={() => (showCommentModal = false)}>
					Cancel
				</Button>
				<Button type="submit" variant="primary">Add Comment</Button>
			</div>
		</form>
	</Modal>
{/if}
