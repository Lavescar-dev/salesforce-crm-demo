<script lang="ts">
	import { goto } from '$app/navigation';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Opportunity, SelectOption } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { format } from 'date-fns';

	let formData = $state({
		name: '',
		accountId: '',
		amount: 0,
		closeDate: format(new Date(), 'yyyy-MM-dd'), // Default to today
		stage: 'Prospecting' as Opportunity['stage'],
		type: 'New Business' as Opportunity['type'],
		probability: 10
	});

	let formErrors = $state({
		name: '',
		accountId: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			name: '',
			accountId: ''
		};

		if (!formData.name) {
			errors.name = 'Opportunity Name is required.';
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

	const stageOptions: SelectOption[] = [
		{ value: 'Prospecting', label: 'Prospecting' },
		{ value: 'Qualification', label: 'Qualification' },
		{ value: 'Needs Analysis', label: 'Needs Analysis' },
		{ value: 'Value Proposition', label: 'Value Proposition' },
		{ value: 'Perception Analysis', label: 'Perception Analysis' },
		{ value: 'Proposal/Price Quote', label: 'Proposal/Price Quote' },
		{ value: 'Negotiation/Review', label: 'Negotiation/Review' },
		{ value: 'Closed Won', label: 'Closed Won' },
		{ value: 'Closed Lost', label: 'Closed Lost' }
	];

	const typeOptions: SelectOption[] = [
		{ value: 'New Business', label: 'New Business' },
		{ value: 'Existing Business', label: 'Existing Business' }
	];

	const probabilityOptions: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
		value: (i + 1) * 10,
		label: `${(i + 1) * 10}%`
	}));

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		try {
			const opportunity = opportunitiesStore.create({
				name: formData.name,
				accountId: formData.accountId,
				accountName: accountsStore.items.find((a) => a.id === formData.accountId)?.name || 'N/A', // Assuming accountName is needed for display
				amount: formData.amount,
				closeDate: formData.closeDate,
				stage: formData.stage,
				type: formData.type,
				probability: formData.probability,
				ownerId: authStore.user?.id
			});

			toastStore.success('Opportunity created successfully!');
			goto(`/sales/opportunities/${opportunity.id}`);
		} catch (error) {
			toastStore.error('Failed to create opportunity');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Opportunity</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new sales opportunity</p>
	</div>

	<form onsubmit={handleSubmit}>
		<Card class="p-6">
			<div class="space-y-6">
				<!-- Basic Information -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Opportunity Details</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="name" class="form-label">Opportunity Name *</label>
							<Input id="name" bind:value={formData.name} required class={formErrors.name ? 'border-red-500' : ''} />
							{#if formErrors.name}
								<p class="text-red-500 text-sm mt-1">{formErrors.name}</p>
							{/if}
						</div>
						<div>
							<label for="accountId" class="form-label">Account *</label>
							<Select id="accountId" bind:value={formData.accountId} options={accountOptions} required placeholder="Select an Account" class={formErrors.accountId ? 'border-red-500' : ''} />
							{#if formErrors.accountId}
								<p class="text-red-500 text-sm mt-1">{formErrors.accountId}</p>
							{/if}
						</div>
						<div>
							<label for="amount" class="form-label">Amount</label>
							<Input id="amount" type="number" bind:value={formData.amount} />
						</div>
						<div>
							<label for="closeDate" class="form-label">Close Date</label>
							<Input id="closeDate" type="date" bind:value={formData.closeDate} />
						</div>
					</div>
				</div>

				<!-- Stage & Type -->
				<div>
					<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4">Stage & Type</h2>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label for="stage" class="form-label">Stage</label>
							<Select id="stage" bind:value={formData.stage} options={stageOptions} />
						</div>
						<div>
							<label for="type" class="form-label">Type</label>
							<Select id="type" bind:value={formData.type} options={typeOptions} />
						</div>
						<div>
							<label for="probability" class="form-label">Probability (%)</label>
							<Select id="probability" bind:value={formData.probability} options={probabilityOptions} />
						</div>
					</div>
				</div>
			</div>
		</Card>

		<div class="mt-6 flex gap-3 justify-end">
			<Button type="button" variant="secondary" onclick={() => goto('/sales/opportunities')}>
				Cancel
			</Button>
			<Button type="submit" variant="primary">Create Opportunity</Button>
		</div>
	</form>
</div>
