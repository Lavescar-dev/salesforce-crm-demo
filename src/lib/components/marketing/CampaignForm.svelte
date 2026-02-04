<script lang="ts">
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Campaign, SelectOption } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { format } from 'date-fns';

	interface Props {
		initialCampaign?: Campaign | null;
		onSubmitted: (campaign: Campaign) => void;
		onCancel: () => void;
	}

	let { initialCampaign, onSubmitted, onCancel }: Props = $props();

	let formData = $state({
		name: initialCampaign?.name || '',
		type: initialCampaign?.type || 'Email',
		status: initialCampaign?.status || 'Planned',
		startDate: initialCampaign?.startDate || format(new Date(), 'yyyy-MM-dd'),
		endDate: initialCampaign?.endDate || format(new Date(), 'yyyy-MM-dd'),
		budget: initialCampaign?.budget || 0,
		actualCost: initialCampaign?.actualCost || 0,
		revenue: initialCampaign?.revenue || 0,
		description: initialCampaign?.description || ''
	});

	let formErrors = $state({
		name: '',
		startDate: '',
		endDate: ''
	});

	function validateForm(): boolean {
		let isValid = true;
		const errors = {
			name: '',
			startDate: '',
			endDate: ''
		};

		if (!formData.name) {
			errors.name = 'Campaign Name is required.';
			isValid = false;
		}
		if (!formData.startDate) {
			errors.startDate = 'Start Date is required.';
			isValid = false;
		}
		if (!formData.endDate) {
			errors.endDate = 'End Date is required.';
			isValid = false;
		}

		formErrors = errors;
		return isValid;
	}

	const typeOptions: SelectOption[] = [
		{ value: 'Email', label: 'Email' },
		{ value: 'Webinar', label: 'Webinar' },
		{ value: 'Conference', label: 'Conference' },
		{ value: 'Trade Show', label: 'Trade Show' },
		{ value: 'Direct Mail', label: 'Direct Mail' },
		{ value: 'Other', label: 'Other' }
	];

	const statusOptions: SelectOption[] = [
		{ value: 'Planned', label: 'Planned' },
		{ value: 'In Progress', label: 'In Progress' },
		{ value: 'Completed', label: 'Completed' },
		{ value: 'Aborted', label: 'Aborted' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.error('Please correct the form errors.');
			return;
		}

		if (initialCampaign) {
			// Update existing campaign
			try {
				const updatedCampaign = campaignsStore.update(initialCampaign.id, {
					name: formData.name,
					type: formData.type,
					status: formData.status,
					startDate: formData.startDate,
					endDate: formData.endDate,
					budget: formData.budget,
					actualCost: formData.actualCost,
					revenue: formData.revenue,
					description: formData.description
				});
				if (updatedCampaign) {
					toastStore.success('Campaign updated successfully!');
					onSubmitted(updatedCampaign);
				} else {
					toastStore.error('Failed to update campaign.');
				}
			} catch (error) {
				console.error('Error updating campaign:', error);
				toastStore.error('Failed to update campaign.');
			}
		} else {
			// Create new campaign
			try {
				const newCampaign = campaignsStore.create({
					name: formData.name,
					type: formData.type,
					status: formData.status,
					startDate: formData.startDate,
					endDate: formData.endDate,
					budget: formData.budget,
					actualCost: formData.actualCost,
					revenue: formData.revenue,
					description: formData.description,
					ownerId: authStore.user?.id
				});
				toastStore.success('Campaign created successfully!');
				onSubmitted(newCampaign);
			} catch (error) {
				console.error('Error creating campaign:', error);
				toastStore.error('Failed to create campaign.');
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="name" class="form-label">Campaign Name *</label>
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
			<label for="status" class="form-label">Status</label>
			<Select id="status" bind:value={formData.status} options={statusOptions} />
		</div>
		<div>
			<label for="startDate" class="form-label">Start Date *</label>
			<Input id="startDate" type="date" bind:value={formData.startDate} required class={formErrors.startDate ? 'border-red-500' : ''} />
			{#if formErrors.startDate}
				<p class="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
			{/if}
		</div>
		<div>
			<label for="endDate" class="form-label">End Date *</label>
			<Input id="endDate" type="date" bind:value={formData.endDate} required class={formErrors.endDate ? 'border-red-500' : ''} />
			{#if formErrors.endDate}
				<p class="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
			{/if}
		</div>
		<div>
			<label for="budget" class="form-label">Budget</label>
			<Input id="budget" type="number" bind:value={formData.budget} />
		</div>
		<div>
			<label for="actualCost" class="form-label">Actual Cost</label>
			<Input id="actualCost" type="number" bind:value={formData.actualCost} />
		</div>
		<div>
			<label for="revenue" class="form-label">Expected Revenue</label>
			<Input id="revenue" type="number" bind:value={formData.revenue} />
		</div>
	</div>

	<div>
		<label for="description" class="form-label">Description</label>
		<Textarea id="description" bind:value={formData.description} rows={4} />
	</div>

	<div class="flex gap-3 justify-end">
		<Button type="button" variant="secondary" onclick={onCancel}>Cancel</Button>
		<Button type="submit" variant="primary">{initialCampaign ? 'Update Campaign' : 'Create Campaign'}</Button>
	</div>
</form>
