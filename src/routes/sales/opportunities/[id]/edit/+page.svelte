<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { Opportunity, SelectOption } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { format } from 'date-fns';

	let opportunityId = $page.params.id;
	let existingOpportunity = opportunitiesStore.getById(opportunityId);

	if (!existingOpportunity) {
		toastStore.error('Opportunity not found!');
		goto('/sales/opportunities');
	}

	let formData = $state({
		name: existingOpportunity?.name || '',
		accountId: existingOpportunity?.accountId || '',
		amount: existingOpportunity?.amount || 0,
		closeDate: existingOpportunity?.closeDate || format(new Date(), 'yyyy-MM-dd'),
		stage: existingOpportunity?.stage || 'Prospecting',
		type: existingOpportunity?.type || 'New Business',
		probability: existingOpportunity?.probability || 10
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

		if (!opportunityId) {
			toastStore.error('Opportunity ID is missing.');
			return;
		}

		try {
			const updatedOpportunity = opportunitiesStore.update(opportunityId, {
				name: formData.name,
				accountId: formData.accountId,
				accountName: accountsStore.items.find((a) => a.id === formData.accountId)?.name || 'N/A',
				amount: formData.amount,
				closeDate: formData.closeDate,
				stage: formData.stage,
				type: formData.type,
				probability: formData.probability
			});

			if (updatedOpportunity) {
				toastStore.success('Opportunity updated successfully!');
				goto(`/sales/opportunities/${updatedOpportunity.id}`);
			} else {
				toastStore.error('Failed to update opportunity: Opportunity not found.');
			}
		} catch (error) {
			console.error('Error updating opportunity:', error);
			toastStore.error('Failed to update opportunity.');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Opportunity</h1>
		<p class="text-salesforce-gray-600 mt-1">Update opportunity information</p>
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
			<Button type="button" variant="secondary" onclick={() => goto(`/sales/opportunities/${opportunityId}`)}>
				Cancel
			</Button>
			<Button type="submit" variant="primary">Update Opportunity</Button>
		</div>
	</form>
</div>
