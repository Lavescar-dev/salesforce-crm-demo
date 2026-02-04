<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { Account, DataTableColumn, Contact, Opportunity } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import ActivityLog from '$lib/components/sales/ActivityLog.svelte';
	import ActivityForm from '$lib/components/sales/ActivityForm.svelte';
	import { Edit, Trash2, ArrowLeft, Users, TrendingUp, Plus } from 'lucide-svelte';
	import { activitiesStore } from '$lib/stores/activities.svelte';

	const accountId = $derived($page.params.id);
	const account = $derived(accountsStore.getById(accountId));

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);

	$effect(() => {
		contactsStore.load();
		opportunitiesStore.load();
		activitiesStore.load();
	});

	const relatedContacts = $derived(() => contactsStore.getByAccountId(accountId));
	const relatedOpportunities = $derived(() => opportunitiesStore.getByAccountId(accountId));
	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === accountId));

	function handleEdit() {
		goto(`/sales/accounts/${accountId}/edit`);
	}

	function handleDelete() {
		if (accountsStore.delete(accountId)) {
			toastStore.success('Account deleted successfully!');
			goto('/sales/accounts');
		} else {
			toastStore.error('Failed to delete account');
		}
	}

	const contactColumns: DataTableColumn[] = [
		{ key: 'firstName', label: 'First Name' },
		{ key: 'lastName', label: 'Last Name' },
		{ key: 'title', label: 'Title' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' }
	];

	function handleContactRowClick(contact: Contact) {
		goto(`/sales/contacts/${contact.id}`);
	}

	const opportunityColumns: DataTableColumn[] = [
		{ key: 'name', label: 'Opportunity Name' },
		{
			key: 'stage',
			label: 'Stage',
			render: (row: Opportunity) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'gray';
				switch (row.stage) {
					case 'Prospecting':
						variant = 'blue';
						break;
					case 'Qualification':
						variant = 'yellow';
						break;
					case 'Needs Analysis':
						variant = 'yellow';
						break;
					case 'Value Proposition':
						variant = 'yellow';
						break;
					case 'Perception Analysis':
						variant = 'yellow';
						break;
					case 'Proposal/Price Quote':
						variant = 'blue';
						break;
					case 'Negotiation/Review':
						variant = 'blue';
						break;
					case 'Closed Won':
						variant = 'green';
						break;
					case 'Closed Lost':
						variant = 'red';
						break;
				}
				return `
					<div class="flex justify-center">
						<span class="badge badge-${variant}">${row.stage}</span>
					</div>
				`;
			}
		},
		{ key: 'amount', label: 'Amount', render: (row: Opportunity) => formatters.currency(row.amount) },
		{ key: 'closeDate', label: 'Close Date', render: (row: Opportunity) => formatters.date(row.closeDate) }
	];

	function handleOpportunityRowClick(opportunity: Opportunity) {
		goto(`/sales/opportunities/${opportunity.id}`);
	}
</script>

{#if !account}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Account not found</p>
			<Button variant="secondary" onclick={() => goto('/sales/accounts')} class="mt-4">
				Back to Accounts
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/sales/accounts')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Accounts
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{account.name}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">Type: {account.type}</p>
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
			<!-- Account Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Account Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Account Name</p>
						<p class="font-medium">{account.name}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Type</p>
						<p class="font-medium">{account.type}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Industry</p>
						<p class="font-medium">{account.industry || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Annual Revenue</p>
						<p class="font-medium">
							{account.annualRevenue ? formatters.currency(account.annualRevenue) : 'N/A'}
						</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Employees</p>
						<p class="font-medium">
							{account.numberOfEmployees ? formatters.number(account.numberOfEmployees) : 'N/A'}
						</p>
					</div>
				</div>
			</Card>

			<!-- Address -->
			{#if account.address}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Address</h2>
					<div class="text-salesforce-gray-700">
						{#if account.address.street}
							<p>{account.address.street}</p>
						{/if}
						<p>
							{[account.address.city, account.address.state, account.address.postalCode]
								.filter(Boolean)
								.join(', ')}
						</p>
						{#if account.address.country}
							<p>{account.address.country}</p>
						{/if}
					</div>
				</Card>
			{/if}

			<!-- Description -->
			{#if account.description}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Description</h2>
					<p class="text-salesforce-gray-700 whitespace-pre-wrap">{account.description}</p>
				</Card>
			{/if}

			<!-- Related Contacts -->
			<Card class="p-6">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-salesforce-gray-900">Related Contacts</h2>
					<Button size="sm" variant="secondary" onclick={() => goto(`/sales/contacts/new?accountId=${accountId}`)}>
						<Users size={16} class="mr-1" /> New Contact
					</Button>
				</div>
				{#if relatedContacts.length > 0}
					<DataTable data={relatedContacts} columns={contactColumns} onRowClick={handleContactRowClick} />
				{:else}
					<p class="text-salesforce-gray-600">No contacts associated with this account.</p>
				{/if}
			</Card>

			<!-- Related Opportunities -->
			<Card class="p-6">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-salesforce-gray-900">Related Opportunities</h2>
					<Button size="sm" variant="secondary" onclick={() => goto(`/sales/opportunities/new?accountId=${accountId}`)}>
						<TrendingUp size={16} class="mr-1" /> New Opportunity
					</Button>
				</div>
				{#if relatedOpportunities.length > 0}
					<DataTable data={relatedOpportunities} columns={opportunityColumns} onRowClick={handleOpportunityRowClick} />
				{:else}
					<p class="text-salesforce-gray-600">No opportunities associated with this account.</p>
				{/if}
			</Card>

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(account.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(account.updatedAt)}</p>
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

	<Modal isOpen={showDeleteModal} title="Delete Account" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this account? This action cannot be undone. This will also delete related contacts and opportunities.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Account" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={accountId}
			relatedToType="Account"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>
{/if}
