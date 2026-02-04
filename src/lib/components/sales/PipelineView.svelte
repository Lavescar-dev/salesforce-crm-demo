<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import type { Opportunity } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatters } from '$lib/utils';
	import { goto } from '$app/navigation';

	interface Props {
		opportunities: Opportunity[];
		onOpportunityDrop: (opportunityId: string, newStage: Opportunity['stage']) => void;
	}

	let { opportunities, onOpportunityDrop }: Props = $props();

	const stages: Opportunity['stage'][] = [
		'Prospecting',
		'Qualification',
		'Needs Analysis',
		'Value Proposition',
		'Perception Analysis',
		'Proposal/Price Quote',
		'Negotiation/Review',
		'Closed Won',
		'Closed Lost'
	];

	const stageColors: Record<Opportunity['stage'], string> = {
		Prospecting: 'blue',
		Qualification: 'yellow',
		'Needs Analysis': 'yellow',
		'Value Proposition': 'yellow',
		'Perception Analysis': 'yellow',
		'Proposal/Price Quote': 'blue',
		'Negotiation/Review': 'blue',
		'Closed Won': 'green',
		'Closed Lost': 'red'
	};

	function handleDragEnd(event: CustomEvent) {
		const { info } = event.detail;
		const opportunityId = info.item.id;
		const newStage = info.dropzone.id;

		if (stages.includes(newStage as Opportunity['stage'])) {
			onOpportunityDrop(opportunityId, newStage as Opportunity['stage']);
		}
	}
</script>

<div class="flex overflow-x-auto gap-4 py-4">
	{#each stages as stage (stage)}
		{@const opportunitiesInStage = opportunities.filter((o) => o.stage === stage)}
		<div
			class="flex-shrink-0 w-80 bg-salesforce-gray-50 p-4 rounded-lg shadow-inner border border-salesforce-gray-200"
		>
				<h3 class="font-semibold text-lg text-salesforce-gray-800 mb-4">{stage} ({opportunitiesInStage.length})</h3>
				<div
					class="space-y-3 min-h-[100px]"
					use:dndzone={{ items: opportunitiesInStage, dropTargetElement: stage, id: stage }}
					on:finalize={handleDragEnd}
				>
					{#each opportunitiesInStage as opportunity (opportunity.id)}
						<div>
							<Card class="p-3 hover:shadow-md transition-shadow">
								<a href={`/sales/opportunities/${opportunity.id}`} class="block">
									<h4 class="font-medium text-salesforce-blue-700 hover:underline">{opportunity.name}</h4>
									<p class="text-sm text-salesforce-gray-600">
									<span class="font-semibold">{formatters.currency(opportunity.amount)}</span> - {opportunity.accountName}
								</p>
								<div class="flex items-center gap-2 mt-2">
									<Badge variant={stageColors[opportunity.stage]}>{opportunity.stage}</Badge>
									<span class="text-xs text-salesforce-gray-500">Close: {formatters.date(opportunity.closeDate)}</span>
								</div>
							</a>
						</Card>
						</div>
					{/each}
					{#if opportunitiesInStage.length === 0}
						<div class="text-salesforce-gray-500 text-center py-8 border-2 border-dashed border-salesforce-gray-200 rounded">
							No opportunities in this stage.
						</div>
					{/if}
				</div>
			</div>
	{/each}
</div>
