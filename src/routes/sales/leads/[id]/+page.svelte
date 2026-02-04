<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { leadsStore } from '$lib/stores/leads.svelte';
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

	const leadId = $derived($page.params.id);
	const lead = $derived(leadsStore.getById(leadId));

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);

	$effect(() => {
		activitiesStore.load();
	});

	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === leadId));

	const statusBadgeVariant = $derived(() => {
		if (!lead) return 'gray';
		const variants: Record<typeof lead.status, any> = {
			New: 'blue',
			Working: 'yellow',
			Nurturing: 'gray',
			Qualified: 'green',
			Unqualified: 'red'
		};
		return variants[lead.status] || 'gray';
	});

	function handleEdit() {
		goto(`/sales/leads/${leadId}/edit`);
	}

	function handleDelete() {
		if (leadsStore.delete(leadId)) {
			toastStore.success('Lead deleted successfully!');
			goto('/sales/leads');
		} else {
			toastStore.error('Failed to delete lead');
		}
	}
</script>

{#if !lead}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Lead not found</p>
			<Button variant="secondary" onclick={() => goto('/sales/leads')} class="mt-4">
				Back to Leads
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/sales/leads')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Leads
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{lead.firstName}
						{lead.lastName}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">{lead.company}</p>
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
			<!-- Basic Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Basic Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Name</p>
						<p class="font-medium">{lead.firstName} {lead.lastName}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Company</p>
						<p class="font-medium">{lead.company}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Title</p>
						<p class="font-medium">{lead.title || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Email</p>
						<p class="font-medium">
							<a href="mailto:{lead.email}" class="text-salesforce-blue-500 hover:underline">
								{lead.email}
							</a>
						</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Phone</p>
						<p class="font-medium">{lead.phone ? formatters.phone(lead.phone) : 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Status</p>
						<Badge variant={statusBadgeVariant()}>{lead.status}</Badge>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Source</p>
						<p class="font-medium">{lead.source}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Rating</p>
						<p class="font-medium">{lead.rating || 'N/A'}</p>
					</div>
				</div>
			</Card>

			<!-- Company Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Company Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Industry</p>
						<p class="font-medium">{lead.industry || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Annual Revenue</p>
						<p class="font-medium">
							{lead.annualRevenue ? formatters.currency(lead.annualRevenue) : 'N/A'}
						</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Employees</p>
						<p class="font-medium">
							{lead.numberOfEmployees ? formatters.number(lead.numberOfEmployees) : 'N/A'}
						</p>
					</div>
				</div>
			</Card>

			<!-- Address -->
			{#if lead.address}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Address</h2>
					<div class="text-salesforce-gray-700">
						{#if lead.address.street}
							<p>{lead.address.street}</p>
						{/if}
						<p>
							{[lead.address.city, lead.address.state, lead.address.postalCode]
								.filter(Boolean)
								.join(', ')}
						</p>
						{#if lead.address.country}
							<p>{lead.address.country}</p>
						{/if}
					</div>
				</Card>
			{/if}

			<!-- Description -->
			{#if lead.description}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Description</h2>
					<p class="text-salesforce-gray-700 whitespace-pre-wrap">{lead.description}</p>
				</Card>
			{/if}

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(lead.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(lead.updatedAt)}</p>
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

	<Modal isOpen={showDeleteModal} title="Delete Lead" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this lead? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Lead" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={leadId}
			relatedToType="Lead"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>
{/if}
