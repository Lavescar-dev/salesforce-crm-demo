<script lang="ts">
	import { goto } from '$app/navigation';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Account, SelectOption } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import AddressInput from '$lib/components/forms/AddressInput.svelte';

	let formData = $state({
		name: '',
		type: 'Customer' as Account['type'],
		industry: '',
		annualRevenue: 0,
		numberOfEmployees: 0,
		description: '',
		address: {
			street: '',
			city: '',
			state: '',
			postalCode: '',
			country: 'USA'
		}
	});

	let formErrors = $state({
		name: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			name: ''
		};

		if (!formData.name) {
			errors.name = 'Account Name is required.';
			isValid = false;
		}

		formErrors = errors;
		return isValid;
	}

	const typeOptions: SelectOption[] = [
		{ value: 'Customer', label: 'Customer' },
		{ value: 'Prospect', label: 'Prospect' },
		{ value: 'Partner', label: 'Partner' },
		{ value: 'Reseller', label: 'Reseller' },
		{ value: 'Other', label: 'Other' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		try {
			const account = accountsStore.create({
				name: formData.name,
				type: formData.type,
				industry: formData.industry,
				annualRevenue: formData.annualRevenue,
				numberOfEmployees: formData.numberOfEmployees,
				description: formData.description,
				address: formData.address,
				ownerId: authStore.user?.id
			});

			toastStore.success('Account created successfully!');
			goto(`/sales/accounts/${account.id}`);
		} catch (error) {
			toastStore.error('Failed to create account');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Account</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new customer account</p>
	</div>

	<form onsubmit={handleSubmit}>
		<Card class="p-6">
			<div class="space-y-6">
				<!-- Basic Information -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Account Information</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="name" class="form-label">Account Name *</label>
							<Input id="name" bind:value={formData.name} required class={formErrors.name ? 'border-red-500' : ''} />
							{#if formErrors.name}
								<p class="text-red-500 text-sm mt-1">{formErrors.name}</p>
							{/if}
						</div>
						<div>
							<label for="type" class="form-label">Type</label>
							<Select id="type" bind:value={formData.type} options={typeOptions} />
						</div>
						<div>
							<label for="industry" class="form-label">Industry</label>
							<Input id="industry" bind:value={formData.industry} />
						</div>
						<div>
							<label for="annualRevenue" class="form-label">Annual Revenue</label>
							<Input id="annualRevenue" type="number" bind:value={formData.annualRevenue} />
						</div>
						<div>
							<label for="numberOfEmployees" class="form-label">Employees</label>
							<Input id="numberOfEmployees" type="number" bind:value={formData.numberOfEmployees} />
						</div>
					</div>
				</div>

				<!-- Address -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Address</h2>
					<AddressInput address={formData.address} />
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="form-label">Description</label>
					<Textarea id="description" bind:value={formData.description} rows={4} />
				</div>
			</div>
		</Card>

		<div class="mt-6 flex gap-3 justify-end">
			<Button type="button" variant="secondary" onclick={() => goto('/sales/accounts')}>
				Cancel
			</Button>
			<Button type="submit" variant="primary">Create Account</Button>
		</div>
	</form>
</div>
