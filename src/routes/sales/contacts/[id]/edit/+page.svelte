<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { Contact, SelectOption } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { validators } from '$lib/utils/validation';

	let contactId = $page.params.id;
	let existingContact = contactsStore.getById(contactId);

	if (!existingContact) {
		toastStore.error('Contact not found!');
		goto('/sales/contacts');
	}

	let formData = $state({
		firstName: existingContact?.firstName || '',
		lastName: existingContact?.lastName || '',
		email: existingContact?.email || '',
		phone: existingContact?.phone || '',
		title: existingContact?.title || '',
		accountId: existingContact?.accountId || '',
		description: existingContact?.description || ''
	});

	let formErrors = $state({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		accountId: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			accountId: ''
		};

		if (!formData.firstName) {
			errors.firstName = 'First Name is required.';
			isValid = false;
		}
		if (!formData.lastName) {
			errors.lastName = 'Last Name is required.';
			isValid = false;
		}
		if (!formData.email) {
			errors.email = 'Email is required.';
			isValid = false;
		} else if (!validators.email(formData.email)) {
			errors.email = 'Invalid email format.';
			isValid = false;
		}
		if (formData.phone && !validators.phone(formData.phone)) {
			errors.phone = 'Invalid phone format.';
			isValid = false;
		}
		if (!formData.accountId) {
			errors.accountId = 'Account is required.';
			isValid = false;
		}

		formErrors = errors;
		return isValid;
	}

	$effect(() => {
		accountsStore.load();
	});

	const accountOptions = $derived<SelectOption[]>(() => {
		return accountsStore.items.map((account) => ({
			value: account.id,
			label: account.name
		}));
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		if (!contactId) {
			toastStore.error('Contact ID is missing.');
			return;
		}

		try {
			const updatedContact = contactsStore.update(contactId, {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				title: formData.title,
				accountId: formData.accountId,
				accountName: accountsStore.items.find((a) => a.id === formData.accountId)?.name || 'N/A',
				description: formData.description
			});

			if (updatedContact) {
				toastStore.success('Contact updated successfully!');
				goto(`/sales/contacts/${updatedContact.id}`);
			} else {
				toastStore.error('Failed to update contact: Contact not found.');
			}
		} catch (error) {
			console.error('Error updating contact:', error);
			toastStore.error('Failed to update contact.');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Contact</h1>
		<p class="text-salesforce-gray-600 mt-1">Update contact information</p>
	</div>

	<form onsubmit={handleSubmit}>
		<Card class="p-6">
			<div class="space-y-6">
				<!-- Basic Information -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Basic Information</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="firstName" class="form-label">First Name *</label>
							<Input id="firstName" bind:value={formData.firstName} required class={formErrors.firstName ? 'border-red-500' : ''} />
							{#if formErrors.firstName}
								<p class="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
							{/if}
						</div>
						<div>
							<label for="lastName" class="form-label">Last Name *</label>
							<Input id="lastName" bind:value={formData.lastName} required class={formErrors.lastName ? 'border-red-500' : ''} />
							{#if formErrors.lastName}
								<p class="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
							{/if}
						</div>
						<div>
							<label for="email" class="form-label">Email *</label>
							<Input id="email" type="email" bind:value={formData.email} required class={formErrors.email ? 'border-red-500' : ''} />
							{#if formErrors.email}
								<p class="text-red-500 text-sm mt-1">{formErrors.email}</p>
							{/if}
						</div>
						<div>
							<label for="phone" class="form-label">Phone</label>
							<Input id="phone" type="tel" bind:value={formData.phone} class={formErrors.phone ? 'border-red-500' : ''} />
							{#if formErrors.phone}
								<p class="text-red-500 text-sm mt-1">{formErrors.phone}</p>
							{/if}
						</div>
						<div>
							<label for="title" class="form-label">Title</label>
							<Input id="title" bind:value={formData.title} />
						</div>
						<div>
							<label for="accountId" class="form-label">Account *</label>
							<Select id="accountId" bind:value={formData.accountId} options={accountOptions} required placeholder="Select an Account" class={formErrors.accountId ? 'border-red-500' : ''} />
							{#if formErrors.accountId}
								<p class="text-red-500 text-sm mt-1">{formErrors.accountId}</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="form-label">Description</label>
					<Textarea id="description" bind:value={formData.description} rows={4} />
				</div>
			</div>
		</Card>

		<div class="mt-6 flex gap-3 justify-end">
			<Button type="button" variant="secondary" onclick={() => goto(`/sales/contacts/${contactId}`)}>
				Cancel
			</Button>
			<Button type="submit" variant="primary">Update Contact</Button>
		</div>
	</form>
</div>
