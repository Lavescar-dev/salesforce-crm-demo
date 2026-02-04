<script lang="ts">
	import { casesStore } from '$lib/stores/cases.svelte';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Case, SelectOption } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	interface Props {
		initialCase?: Case | null;
		onSubmitted: (caseItem: Case) => void;
		onCancel: () => void;
	}

	let { initialCase, onSubmitted, onCancel }: Props = $props();

	let formData = $state({
		subject: initialCase?.subject || '',
		description: initialCase?.description || '',
		status: initialCase?.status || 'New',
		priority: initialCase?.priority || 'Medium',
		type: initialCase?.type || 'Problem',
		origin: initialCase?.origin || 'Web',
		contactId: initialCase?.contactId || '',
		accountId: initialCase?.accountId || ''
	});

	let formErrors = $state({
		subject: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			subject: ''
		};

		if (!formData.subject) {
			errors.subject = 'Subject is required.';
			isValid = false;
		}

		formErrors = errors;
		return isValid;
	}

	$effect(() => {
		contactsStore.load();
		accountsStore.load();
	});

	const contactOptions = $derived<SelectOption[]>(() => {
		return contactsStore.items.map((contact) => ({
			value: contact.id,
			label: `${contact.firstName} ${contact.lastName}`
		}));
	});

	const accountOptions = $derived<SelectOption[]>(() => {
		return accountsStore.items.map((account) => ({
			value: account.id,
			label: account.name
		}));
	});

	const statusOptions: SelectOption[] = [
		{ value: 'New', label: 'New' },
		{ value: 'Working', label: 'Working' },
		{ value: 'Escalated', label: 'Escalated' },
		{ value: 'On Hold', label: 'On Hold' },
		{ value: 'Closed', label: 'Closed' }
	];

	const priorityOptions: SelectOption[] = [
		{ value: 'Low', label: 'Low' },
		{ value: 'Medium', label: 'Medium' },
		{ value: 'High', label: 'High' },
		{ value: 'Critical', label: 'Critical' }
	];

	const typeOptions: SelectOption[] = [
		{ value: 'Question', label: 'Question' },
		{ value: 'Problem', label: 'Problem' },
		{ value: 'Feature Request', label: 'Feature Request' },
		{ value: 'Other', label: 'Other' }
	];

	const originOptions: SelectOption[] = [
		{ value: 'Phone', label: 'Phone' },
		{ value: 'Email', label: 'Email' },
		{ value: 'Web', label: 'Web' },
		{ value: 'Chat', label: 'Chat' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		if (initialCase) {
			// Update existing case
			try {
				const updatedCase = casesStore.update(initialCase.id, {
					subject: formData.subject,
					description: formData.description,
					status: formData.status,
					priority: formData.priority,
					type: formData.type,
					origin: formData.origin,
					contactId: formData.contactId || undefined,
					accountId: formData.accountId || undefined,
					// No caseNumber update, it's typically auto-generated
				});
				if (updatedCase) {
					toastStore.success('Case updated successfully!');
					onSubmitted(updatedCase);
				} else {
					toastStore.error('Failed to update case.');
				}
			} catch (error) {
				console.error('Error updating case:', error);
				toastStore.error('Failed to update case.');
			}
		} else {
			// Create new case
			try {
				const newCase = casesStore.create({
					caseNumber: `CAS-${Date.now().toString().slice(-6)}`, // Simple unique number
					subject: formData.subject,
					description: formData.description,
					status: formData.status,
					priority: formData.priority,
					type: formData.type,
					origin: formData.origin,
					contactId: formData.contactId || undefined,
					accountId: formData.accountId || undefined,
					ownerId: authStore.user?.id
				});
				toastStore.success('Case created successfully!');
				onSubmitted(newCase);
			} catch (error) {
				console.error('Error creating case:', error);
				toastStore.error('Failed to create case.');
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="subject" class="form-label">Subject *</label>
			<Input id="subject" bind:value={formData.subject} required class={formErrors.subject ? 'border-red-500' : ''} />
			{#if formErrors.subject}
				<p class="text-red-500 text-sm mt-1">{formErrors.subject}</p>
			{/if}
		</div>
		<div>
			<label for="status" class="form-label">Status</label>
			<Select id="status" bind:value={formData.status} options={statusOptions} />
		</div>
		<div>
			<label for="priority" class="form-label">Priority</label>
			<Select id="priority" bind:value={formData.priority} options={priorityOptions} />
		</div>
		<div>
			<label for="type" class="form-label">Type</label>
			<Select id="type" bind:value={formData.type} options={typeOptions} />
		</div>
		<div>
			<label for="origin" class="form-label">Origin</label>
			<Select id="origin" bind:value={formData.origin} options={originOptions} />
		</div>
		<div>
			<label for="contact" class="form-label">Contact</label>
			<Select id="contact" bind:value={formData.contactId} options={contactOptions} placeholder="Select Contact" optional />
		</div>
		<div>
			<label for="account" class="form-label">Account</label>
			<Select id="account" bind:value={formData.accountId} options={accountOptions} placeholder="Select Account" optional />
		</div>
	</div>

	<div>
		<label for="description" class="form-label">Description</label>
		<Textarea id="description" bind:value={formData.description} rows={4} />
	</div>

	<div class="flex gap-3 justify-end">
		<Button type="button" variant="secondary" onclick={onCancel}>Cancel</Button>
		<Button type="submit" variant="primary">{initialCase ? 'Update Case' : 'Create Case'}</Button>
	</div>
</form>
