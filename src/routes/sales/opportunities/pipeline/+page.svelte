<script lang="ts">
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import type { Opportunity } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import PipelineView from '$lib/components/sales/PipelineView.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	$effect(() => {
		opportunitiesStore.load();
	});

	const opportunities = $derived(opportunitiesStore.items);

	function handleOpportunityDrop(opportunityId: string, newStage: Opportunity['stage']) {
		try {
			const updatedOpportunity = opportunitiesStore.updateOpportunityStage(opportunityId, newStage);
			if (updatedOpportunity) {
				toastStore.success(`Opportunity "${updatedOpportunity.name}" moved to ${newStage}.`);
			} else {
				toastStore.error('Failed to update opportunity stage.');
			}
		} catch (error) {
			console.error('Error updating opportunity stage:', error);
			toastStore.error('Failed to update opportunity stage.');
		}
	}
</script>

<div class="max-w-full mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Sales Pipeline</h1>
		<p class="text-salesforce-gray-600 mt-1">Visualize and manage your sales opportunities</p>
	</div>

	<Card class="p-4 overflow-x-auto">
		<PipelineView {opportunities} onOpportunityDrop={handleOpportunityDrop} />
	</Card>
</div>
