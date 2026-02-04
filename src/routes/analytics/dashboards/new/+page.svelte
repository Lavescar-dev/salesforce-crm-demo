<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { dashboardsStore } from '$lib/stores/dashboards.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { Dashboard } from '$lib/types';

	let dashboardName = $state('');
	let isPublic = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!dashboardName.trim()) {
			toastStore.error('Dashboard name is required.');
			return;
		}

		try {
			const newDashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt' | 'widgets'> = {
				name: dashboardName,
				isPublic: isPublic
			};
			const dashboard = dashboardsStore.create(newDashboard);
			toastStore.success('Dashboard created successfully! Now you can add widgets.');
			goto(`/analytics/dashboards/${dashboard.id}/edit`); // Go to edit page to add widgets
		} catch (error) {
			console.error('Error creating dashboard:', error);
			toastStore.error('Failed to create dashboard.');
		}
	}

	function handleCancel() {
		goto('/analytics/dashboards');
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Dashboard</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new analytics dashboard</p>
	</div>

	<Card class="p-6">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="dashboardName" class="form-label">Dashboard Name *</label>
				<Input id="dashboardName" bind:value={dashboardName} required />
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" id="isPublic" bind:checked={isPublic} class="form-checkbox" />
				<label for="isPublic" class="form-label !mb-0">Make Public</label>
			</div>

			<div class="flex gap-3 justify-end">
				<Button type="button" variant="secondary" onclick={handleCancel}>Cancel</Button>
				<Button type="submit" variant="primary">Create Dashboard</Button>
			</div>
		</form>
	</Card>
</div>
