<script lang="ts">
	import { goto } from '$app/navigation';
	import { leadsStore } from '$lib/stores/leads.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Lead, SelectOption } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { validators } from '$lib/utils/validation';

	let formData = $state({
		firstName: '',
		lastName: '',
		company: '',
		title: '',
		email: '',
		phone: '',
		status: 'New' as Lead['status'],
		source: 'Web' as Lead['source'],
		rating: 'Warm' as Lead['rating'],
		industry: '',
		annualRevenue: 0,
		numberOfEmployees: 0,
		description: '',
		street: '',
		city: '',
		state: '',
		postalCode: '',
		country: 'USA'
	});

	let formErrors = $state({
		firstName: '',
		lastName: '',
		company: '',
		email: '',
		phone: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			firstName: '',
			lastName: '',
			company: '',
			email: '',
			phone: ''
		};

		if (!formData.firstName) {
			errors.firstName = 'First Name is required.';
			isValid = false;
		}
		if (!formData.lastName) {
			errors.lastName = 'Last Name is required.';
			isValid = false;
		}
		if (!formData.company) {
			errors.company = 'Company is required.';
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

		formErrors = errors;
		return isValid;
	}

	const statusOptions: SelectOption[] = [
		{ value: 'New', label: 'New' },
		{ value: 'Working', label: 'Working' },
		{ value: 'Nurturing', label: 'Nurturing' },
		{ value: 'Qualified', label: 'Qualified' },
		{ value: 'Unqualified', label: 'Unqualified' }
	];

	const sourceOptions: SelectOption[] = [
		{ value: 'Web', label: 'Web' },
		{ value: 'Phone Inquiry', label: 'Phone Inquiry' },
		{ value: 'Partner Referral', label: 'Partner Referral' },
		{ value: 'Purchased List', label: 'Purchased List' },
		{ value: 'Other', label: 'Other' }
	];

	const ratingOptions: SelectOption[] = [
		{ value: 'Hot', label: 'Hot' },
		{ value: 'Warm', label: 'Warm' },
		{ value: 'Cold', label: 'Cold' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		try {
			const lead = leadsStore.create({
				firstName: formData.firstName,
				lastName: formData.lastName,
				company: formData.company,
				title: formData.title,
				email: formData.email,
				phone: formData.phone,
				status: formData.status,
				source: formData.source,
				rating: formData.rating,
				industry: formData.industry,
				annualRevenue: formData.annualRevenue,
				numberOfEmployees: formData.numberOfEmployees,
				description: formData.description,
				address: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					postalCode: formData.postalCode,
					country: formData.country
				},
				ownerId: authStore.user?.id
			});

			toastStore.success('Lead created successfully!');
			goto(`/sales/leads/${lead.id}`);
		} catch (error) {
			toastStore.error('Failed to create lead');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Lead</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new sales lead</p>
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
							<label for="company" class="form-label">Company *</label>
							<Input id="company" bind:value={formData.company} required class={formErrors.company ? 'border-red-500' : ''} />
							{#if formErrors.company}
								<p class="text-red-500 text-sm mt-1">{formErrors.company}</p>
							{/if}
						</div>
						<div>
							<label for="title" class="form-label">Title</label>
							<Input id="title" bind:value={formData.title} />
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
					</div>
				</div>

				<!-- Lead Details -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Lead Details</h2>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label for="status" class="form-label">Status</label>
							<Select id="status" bind:value={formData.status} options={statusOptions} />
						</div>
						<div>
							<label for="source" class="form-label">Source</label>
							<Select id="source" bind:value={formData.source} options={sourceOptions} />
						</div>
						<div>
							<label for="rating" class="form-label">Rating</label>
							<Select id="rating" bind:value={formData.rating} options={ratingOptions} />
						</div>
					</div>
				</div>

				<!-- Company Information -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Company Information</h2>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
					<div class="grid grid-cols-1 gap-4">
						<div>
							<label for="street" class="form-label">Street</label>
							<Input id="street" bind:value={formData.street} />
						</div>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<label for="city" class="form-label">City</label>
								<Input id="city" bind:value={formData.city} />
							</div>
							<div>
								<label for="state" class="form-label">State</label>
								<Input id="state" bind:value={formData.state} />
							</div>
							<div>
								<label for="postalCode" class="form-label">Postal Code</label>
								<Input id="postalCode" bind:value={formData.postalCode} />
							</div>
							<div>
								<label for="country" class="form-label">Country</label>
								<Input id="country" bind:value={formData.country} />
							</div>
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
			<Button type="button" variant="secondary" onclick={() => goto('/sales/leads')}>
				Cancel
			</Button>
			<Button type="submit" variant="primary">Create Lead</Button>
		</div>
	</form>
</div>
