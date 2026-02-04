<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ActivityLog from '$lib/components/sales/ActivityLog.svelte';
	import ActivityForm from '$lib/components/sales/ActivityForm.svelte';
	import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-svelte';
	import { activitiesStore } from '$lib/stores/activities.svelte';

	const contactId = $derived($page.params.id);
	const contact = $derived(contactsStore.getById(contactId));

	let showDeleteModal = $state(false);
	let showActivityModal = $state(false);

	$effect(() => {
		accountsStore.load(); // Ensure accounts are loaded to get account name
		activitiesStore.load();
	});

	const relatedActivities = $derived(() => activitiesStore.items.filter(activity => activity.relatedToId === contactId));

	const accountName = $derived(() => {
		if (contact?.accountId) {
			return accountsStore.getById(contact.accountId)?.name || 'N/A';
		}
		return 'N/A';
	});

	function handleEdit() {
		goto(`/sales/contacts/${contactId}/edit`);
	}

	function handleDelete() {
		if (contactsStore.delete(contactId)) {
			toastStore.success('Contact deleted successfully!');
			goto('/sales/contacts');
		} else {
			toastStore.error('Failed to delete contact');
		}
	}
</script>

{#if !contact}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Contact not found</p>
			<Button variant="secondary" onclick={() => goto('/sales/contacts')} class="mt-4">
				Back to Contacts
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/sales/contacts')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Contacts
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{contact.firstName}
						{contact.lastName}
					</h1>
					{#if contact.accountId}
						<p class="text-salesforce-gray-600 mt-1">
							Account:
							<a
								href="/sales/accounts/{contact.accountId}"
								class="text-salesforce-blue-500 hover:underline"
								>{accountName}</a
							>
						</p>
					{:else}
						<p class="text-salesforce-gray-600 mt-1">Account: N/A</p>
					{/if}
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
						<p class="font-medium">{contact.firstName} {contact.lastName}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Title</p>
						<p class="font-medium">{contact.title || 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Email</p>
						<p class="font-medium">
							<a href="mailto:{contact.email}" class="text-salesforce-blue-500 hover:underline">
								{contact.email}
							</a>
						</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Phone</p>
						<p class="font-medium">{contact.phone ? formatters.phone(contact.phone) : 'N/A'}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Account</p>
						{#if contact.accountId}
							<a
								href="/sales/accounts/{contact.accountId}"
								class="font-medium text-salesforce-blue-500 hover:underline"
								>{accountName}</a
							>
						{:else}
							<p class="font-medium">N/A</p>
						{/if}
					</div>
				</div>
			</Card>

			<!-- Description -->
			{#if contact.description}
				<Card class="p-6">
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Description</h2>
					<p class="text-salesforce-gray-700 whitespace-pre-wrap">{contact.description}</p>
				</Card>
			{/if}

			<!-- System Information -->
			<Card class="p-6">
				<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">System Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-salesforce-gray-600">Created</p>
						<p class="font-medium">{formatters.dateTime(contact.createdAt)}</p>
					</div>
					<div>
						<p class="text-sm text-salesforce-gray-600">Last Modified</p>
						<p class="font-medium">{formatters.dateTime(contact.updatedAt)}</p>
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

	<Modal isOpen={showDeleteModal} title="Delete Contact" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this contact? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={showActivityModal} title="Log Activity for Contact" onClose={() => (showActivityModal = false)}>
		<ActivityForm
			relatedToId={contactId}
			relatedToType="Contact"
			onActivityCreated={() => {
				activitiesStore.load(); // Refresh activities
				showActivityModal = false;
			}}
			onCancel={() => (showActivityModal = false)}
		/>
	</Modal>
{/if}
