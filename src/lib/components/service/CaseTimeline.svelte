<script lang="ts">
	import type { CaseTimelineEvent } from '$lib/types';
	import { formatters } from '$lib/utils';
	import { MessageSquareText, Edit, History, FileText } from 'lucide-svelte';

	interface Props {
		timelineEvents: CaseTimelineEvent[];
	}

	let { timelineEvents }: Props = $props();

	// Sort events by createdAt date in descending order
	const sortedEvents = $derived(() => {
		return [...timelineEvents].sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	});

	const iconMap = {
		Comment: MessageSquareText,
		StatusChange: History,
		Edit: Edit,
		Note: FileText
	};

	const typeColors = {
		Comment: 'salesforce-blue-600',
		StatusChange: 'salesforce-purple-600',
		Edit: 'salesforce-yellow-600',
		Note: 'salesforce-gray-600'
	};
</script>

<div class="space-y-6">
	{#if sortedEvents.length === 0}
		<div class="text-center py-8 text-salesforce-gray-500">No timeline events to display.</div>
	{:else}
		<ul class="relative timeline">
			{#each sortedEvents as event (event.id)}
				<li class="mb-10 ms-6">
					<span
						class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white"
						class:bg-salesforce-blue-100={event.type === 'Comment'}
						class:text-salesforce-blue-600={event.type === 'Comment'}
						class:bg-salesforce-purple-100={event.type === 'StatusChange'}
						class:text-salesforce-purple-600={event.type === 'StatusChange'}
						class:bg-salesforce-yellow-100={event.type === 'Edit'}
						class:text-salesforce-yellow-600={event.type === 'Edit'}
						class:bg-salesforce-gray-100={event.type === 'Note'}
						class:text-salesforce-gray-600={event.type === 'Note'}
					>
						{#if event.type && iconMap[event.type]}
							{@const Icon = iconMap[event.type]}
							<Icon size={16} />
						{/if}
					</span>
					<div class="items-center justify-between p-4 bg-white border border-salesforce-gray-200 rounded-lg shadow-sm">
						<time class="mb-1 text-xs font-normal text-salesforce-gray-400 sm:order-last sm:mb-0"
							>{formatters.dateTime(event.createdAt)}</time
						>
						<div class="text-sm font-semibold text-salesforce-gray-900 flex items-center gap-2 mb-2">
							{event.title}
						</div>
						<p class="text-sm font-normal text-salesforce-gray-500">{event.description}</p>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="postcss">
	.timeline::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 4px;
		background-color: theme('colors.salesforce.gray.200');
		left: 14px; /* Adjust to align with icon centers */
		top: 0;
		z-index: 0;
	}
</style>
