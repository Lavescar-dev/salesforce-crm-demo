<script lang="ts">
	import type { Activity } from '$lib/types';
	import { formatters } from '$lib/utils';
	import { Calendar, Mail, Phone, Users, FileText } from 'lucide-svelte';

	interface Props {
		activities: Activity[];
	}

	let { activities }: Props = $props();

	// Sort activities by createdAt date in descending order
	const sortedActivities = $derived(() => {
		return [...activities].sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	});

	const iconMap = {
		Call: Phone,
		Email: Mail,
		Meeting: Users, // Using Users for meeting, could be a calendar icon too
		Task: Calendar,
		Note: FileText
	};

	const typeColors = {
		Call: 'salesforce-green-600',
		Email: 'salesforce-orange-600',
		Meeting: 'salesforce-purple-600',
		Task: 'salesforce-blue-600',
		Note: 'salesforce-gray-600'
	};
</script>

<div class="space-y-6">
	{#if sortedActivities.length === 0}
		<div class="text-center py-8 text-salesforce-gray-500">No activities to display.</div>
	{:else}
		<ul class="relative timeline">
			{#each sortedActivities as activity (activity.id)}
				<li class="mb-10 ms-6">
					<span
						class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white"
						class:bg-salesforce-green-100={activity.type === 'Call'}
						class:text-salesforce-green-600={activity.type === 'Call'}
						class:bg-salesforce-orange-100={activity.type === 'Email'}
						class:text-salesforce-orange-600={activity.type === 'Email'}
						class:bg-salesforce-purple-100={activity.type === 'Meeting'}
						class:text-salesforce-purple-600={activity.type === 'Meeting'}
						class:bg-salesforce-blue-100={activity.type === 'Task'}
						class:text-salesforce-blue-600={activity.type === 'Task'}
						class:bg-salesforce-gray-100={activity.type === 'Note'}
						class:text-salesforce-gray-600={activity.type === 'Note'}
					>
						{#if activity.type && iconMap[activity.type]}
							{@const Icon = iconMap[activity.type]}
							<Icon size={16} />
						{/if}
					</span>
					<div class="items-center justify-between p-4 bg-white border border-salesforce-gray-200 rounded-lg shadow-sm">
						<time class="mb-1 text-xs font-normal text-salesforce-gray-400 sm:order-last sm:mb-0"
							>{formatters.dateTime(activity.createdAt)}</time
						>
						<div class="text-sm font-semibold text-salesforce-gray-900 flex items-center gap-2 mb-2">
							{activity.subject}
							<Badge variant={typeColors[activity.type]}>{activity.type}</Badge>
						</div>
						<p class="text-sm font-normal text-salesforce-gray-500">{activity.description || activity.subject}</p>
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
