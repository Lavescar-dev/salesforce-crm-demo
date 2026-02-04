<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import { activitiesStore } from '$lib/stores/activities.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { Campaign } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ActivityLog from '$lib/components/sales/ActivityLog.svelte';
	import ActivityForm from '$lib/components/sales/ActivityForm.svelte';
	import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-svelte';

	const campaignId = $derived($page.params.id);
	const campaign = $derived(campaignsStore.getById(campaignId));

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);

	$effect(() => {
		campaignsStore.load();
		activitiesStore.load();
	});

	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === campaignId));

	const statusBadgeVariant = $derived(() => {
		if (!campaign) return 'gray';
		switch (campaign.status) {
			case 'Planned':
				return 'blue';
			case 'In Progress':
				return 'yellow';
			case 'Completed':
				return 'green';
			case 'Aborted':
				return 'red';
			default:
				return 'gray';
		}
	});

	const roi = $derived(() => {
		if (!campaign) return 0;
		if (campaign.actualCost === 0) return 0;
		return ((campaign.revenue - campaign.actualCost) / campaign.actualCost) * 100;
	});

	const responseRate = $derived(() => {
		if (!campaign) return 0;
		// Mock response rate for now, as campaign members are not implemented
		// In a real scenario, this would be calculated from campaign members
		return Math.floor(Math.random() * 30);
	});


	function handleEdit() {
		goto(`/marketing/campaigns/${campaignId}/edit`);
	}

	function handleDelete() {
		if (campaignsStore.delete(campaignId)) {
			toastStore.success('Campaign deleted successfully!');
			goto('/marketing/campaigns');
		} else {
			toastStore.error('Failed to delete campaign');
		}
	}
</script>

{#if !campaign}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Campaign not found</p>
			<Button variant="secondary" onclick={() => goto('/marketing/campaigns')} class="mt-4">
				Back to Campaigns
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/marketing/campaigns')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Campaigns
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{campaign.name}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Type: {campaign.type}</p>
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
			<!-- Campaign Details -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Campaign Details</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Campaign Name</p>
						<p class="font-medium">{campaign.name}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Type</p>
						<p class="font-medium">{campaign.type}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Status</p>
						<Badge variant={statusBadgeVariant()}>{campaign.status}</Badge>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Start Date</p>
						<p class="font-medium">{formatters.date(campaign.startDate)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">End Date</p>
						<p class="font-medium">{formatters.date(campaign.endDate)}</p>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Budget</p>
						<p class="font-medium">{formatters.currency(campaign.budget)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Actual Cost</p>
						<p class="font-medium">{formatters.currency(campaign.actualCost)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Expected Revenue</p>
						<p class="font-medium">{formatters.currency(campaign.revenue)}</p>
					</div>
				</div>
			</Card>

			<!-- Campaign Analytics -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Analytics</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Return on Investment (ROI)</p>
						<p class="font-medium">{roi.toFixed(2)}%</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Response Rate</p>
						<p class="font-medium">{responseRate}% (Mock Data)</p>
					</div>
				</div>
			</Card>

			<!-- Description -->
			{#if campaign.description}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Description</h2>
					<p class="text-salesforce-gray-700 whitespace-pre-wrap">{campaign.description}</p>
				</Card>
			{/if}

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

			<!-- Campaign Members (Placeholder) -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Campaign Members</h2>
				<p class="text-salesforce-gray-600">Campaign members will be listed here.</p>
				<Button class="mt-4" onclick={() => goto(`/marketing/campaigns/${campaignId}/members`)}>Manage Members</Button>
			</Card>

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(campaign.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(campaign.updatedAt)}</p>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Campaign" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this campaign? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Campaign" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={campaignId}
			relatedToType="Campaign"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>
{/if}
