<script lang="ts">
	import type { CampaignMember, DataTableColumn, Lead, Contact } from '$lib/types';
	import { campaignMembersStore } from '$lib/stores/campaignMembers.svelte';
	import { leadsStore } from '$lib/stores/leads.svelte';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { formatters } from '$lib/utils';
	import DataTable from '$lib/components/data/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { Plus, Trash2 } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	interface Props {
		campaignId: string;
	}

	let { campaignId }: Props = $props();

	let showAddMemberModal = $state(false);
	let newMemberType = $state<'Lead' | 'Contact'>('Lead');
	let selectedLeadId = $state('');
	let selectedContactId = $state('');
	let newMemberStatus = $state<CampaignMember['status']>('Sent');

	$effect(() => {
		campaignMembersStore.load();
		leadsStore.load();
		contactsStore.load();
	});

	const campaignMembers = $derived(() => campaignMembersStore.getByCampaignId(campaignId));

	const availableLeads = $derived(() => {
		return leadsStore.items.filter(
			(lead) => !campaignMembers.some((member) => member.memberId === lead.id && member.memberType === 'Lead')
		);
	});

	const availableContacts = $derived(() => {
		return contactsStore.items.filter(
			(contact) => !campaignMembers.some((member) => member.memberId === contact.id && member.memberType === 'Contact')
		);
	});

	const memberTypeOptions = [
		{ value: 'Lead', label: 'Lead' },
		{ value: 'Contact', label: 'Contact' }
	];

	const leadOptions = $derived(() =>
		availableLeads.map((lead) => ({
			value: lead.id,
			label: `${lead.firstName} ${lead.lastName} (${lead.company})`
		}))
	);

	const contactOptions = $derived(() =>
		availableContacts.map((contact) => ({
			value: contact.id,
			label: `${contact.firstName} ${contact.lastName} (${contact.accountName})`
		}))
	);

	const memberStatusOptions = [
		{ value: 'Sent', label: 'Sent' },
		{ value: 'Opened', label: 'Opened' },
		{ value: 'Responded', label: 'Responded' },
		{ value: 'Attended', label: 'Attended' },
		{ value: 'Converted', label: 'Converted' },
		{ value: 'Bounced', label: 'Bounced' }
	];

	function handleAddMember() {
		let memberId: string | undefined;
		let memberName: string | undefined;

		if (newMemberType === 'Lead') {
			memberId = selectedLeadId;
			memberName = availableLeads.find((l) => l.id === selectedLeadId)?.firstName + ' ' + availableLeads.find((l) => l.id === selectedLeadId)?.lastName;
		} else {
			memberId = selectedContactId;
			memberName = availableContacts.find((c) => c.id === selectedContactId)?.firstName + ' ' + availableContacts.find((c) => c.id === selectedContactId)?.lastName;
		}

		if (!memberId) {
			toastStore.error('Please select a member.');
			return;
		}

		try {
			campaignMembersStore.create({
				campaignId,
				memberId,
				memberType: newMemberType,
				memberName: memberName || 'Unknown',
				status: newMemberStatus
			});
			toastStore.success('Member added to campaign!');
			resetAddMemberForm();
			showAddMemberModal = false;
		} catch (error) {
			console.error('Error adding campaign member:', error);
			toastStore.error('Failed to add campaign member.');
		}
	}

	function handleDeleteMember(memberId: string) {
		if (confirm('Are you sure you want to remove this member from the campaign?')) {
			if (campaignMembersStore.delete(memberId)) {
				toastStore.success('Member removed successfully!');
			} else {
				toastStore.error('Failed to remove member.');
			}
		}
	}

	function resetAddMemberForm() {
		newMemberType = 'Lead';
		selectedLeadId = '';
		selectedContactId = '';
		newMemberStatus = 'Sent';
	}

	const columns: DataTableColumn[] = [
		{ key: 'memberName', label: 'Name' },
		{ key: 'memberType', label: 'Type' },
		{
			key: 'status',
			label: 'Status',
			render: (row: CampaignMember) => {
				let variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' = 'gray';
				switch (row.status) {
					case 'Sent':
						variant = 'blue';
						break;
					case 'Opened':
						variant = 'green';
						break;
					case 'Responded':
						variant = 'purple';
						break;
					case 'Attended':
						variant = 'yellow';
						break;
					case 'Converted':
						variant = 'green';
						break;
					case 'Bounced':
						variant = 'red';
						break;
				}
				return `
					<div class="flex justify-center">
						<span class="badge badge-${variant}">${row.status}</span>
					</div>
				`;
			}
		},
		{ key: 'createdAt', label: 'Added Date', render: (row: CampaignMember) => formatters.dateTime(row.createdAt) },
		{
			key: 'actions',
			label: 'Actions',
			render: (row: CampaignMember) => `
				<div class="flex justify-center">
					<button class="btn btn-sm btn-destructive" data-id="${row.id}" data-action="delete">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
					</button>
				</div>
			`
		}
	];
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-lg font-semibold text-salesforce-gray-900">Campaign Members ({campaignMembers.length})</h2>
		<Button size="sm" onclick={() => (showAddMemberModal = true)}>
			<Plus size={16} class="mr-1" /> Add Member
		</Button>
	</div>

	{#if campaignMembers.length > 0}
		<DataTable data={campaignMembers} {columns} onRowClick={(row, event) => {
			if (event.target instanceof HTMLElement && event.target.dataset.action === 'delete') {
				handleDeleteMember(row.id);
			} else {
				// Navigate to lead/contact detail page
				const path = row.memberType === 'Lead' ? 'leads' : 'contacts';
				goto(`/sales/${path}/${row.memberId}`);
			}
		}} />
	{:else}
		<p class="text-salesforce-gray-600">No members in this campaign yet.</p>
	{/if}
</div>

<Modal isOpen={showAddMemberModal} title="Add Campaign Member" onClose={() => (showAddMemberModal = false)}>
	<div class="space-y-4">
		<div>
			<label for="memberType" class="form-label">Member Type</label>
			<Select id="memberType" bind:value={newMemberType} options={memberTypeOptions} />
		</div>

		{#if newMemberType === 'Lead'}
			<div>
				<label for="leadSelect" class="form-label">Select Lead *</label>
				<Select id="leadSelect" bind:value={selectedLeadId} options={leadOptions} required placeholder="Select a Lead" />
			</div>
		{:else}
			<div>
				<label for="contactSelect" class="form-label">Select Contact *</label>
				<Select id="contactSelect" bind:value={selectedContactId} options={contactOptions} required placeholder="Select a Contact" />
			</div>
		{/if}

		<div>
			<label for="memberStatus" class="form-label">Status</label>
			<Select id="memberStatus" bind:value={newMemberStatus} options={memberStatusOptions} />
		</div>

		<div class="flex gap-3 justify-end">
			<Button type="button" variant="secondary" onclick={() => (showAddMemberModal = false)}>Cancel</Button>
			<Button type="button" variant="primary" onclick={handleAddMember}>Add Member</Button>
		</div>
	</div>
</Modal>
