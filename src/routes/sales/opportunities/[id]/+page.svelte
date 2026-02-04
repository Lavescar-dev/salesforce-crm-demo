<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ActivityLog from '$lib/components/sales/ActivityLog.svelte';
	import ActivityForm from '$lib/components/sales/ActivityForm.svelte';
	import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-svelte';
	import { activitiesStore } from '$lib/stores/activities.svelte';

	const opportunityId = $derived($page.params.id);
	const opportunity = $derived(opportunitiesStore.getById(opportunityId));

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);

	$effect(() => {
		activitiesStore.load();
	});

	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === opportunityId));

	const stageBadgeVariant = $derived(() => {
		if (!opportunity) return 'gray';
		switch (opportunity.stage) {
			case 'Prospecting':
			case 'Qualification':
			case 'Needs Analysis':
			case 'Value Proposition':
			case 'Perception Analysis':
				return 'yellow';
			case 'Proposal/Price Quote':
			case 'Negotiation/Review':
				return 'blue';
			case 'Closed Won':
				return 'green';
			case 'Closed Lost':
				return 'red';
			default:
				return 'gray';
		}
	});

	function handleEdit() {
		goto(`/sales/opportunities/${opportunityId}/edit`);
	}

	function handleDelete() {
		if (opportunitiesStore.delete(opportunityId)) {
			toastStore.success('Opportunity deleted successfully!');
			goto('/sales/opportunities');
		} else {
			toastStore.error('Failed to delete opportunity');
		}
	}
</script>

{#if !opportunity}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Opportunity not found</p>
			<Button variant="secondary" onclick={() => goto('/sales/opportunities')} class="mt-4">
				Back to Opportunities
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/sales/opportunities')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Opportunities
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{opportunity.name}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Account: {opportunity.accountName}</p>
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
			<!-- Opportunity Details -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Opportunity Details</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Opportunity Name</p>
						<p class="font-medium">{opportunity.name}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Account</p>
						<p class="font-medium">{opportunity.accountName}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Amount</p>
						<p class="font-medium">{formatters.currency(opportunity.amount)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Close Date</p>
						<p class="font-medium">{formatters.date(opportunity.closeDate)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Stage</p>
						<Badge variant={stageBadgeVariant()}>{opportunity.stage}</Badge>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Type</p>
						<p class="font-medium">{opportunity.type}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Probability</p>
						<p class="font-medium">{opportunity.probability}%</p>
					</div>
				</div>
			</Card>

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(opportunity.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(opportunity.updatedAt)}</p>
					</div>
				</div>
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
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Opportunity" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this opportunity? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Opportunity" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={opportunityId}
			relatedToType="Opportunity"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>
{/if}
