<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { ArrowUp, ArrowDown } from 'lucide-svelte';

	interface Props {
		title: string;
		value: string | number;
		unit?: string;
		trend?: 'up' | 'down' | 'neutral';
		percentageChange?: number;
		class?: string;
	}

	let { title, value, unit = '', trend = 'neutral', percentageChange, class: className = '' }: Props = $props();

	const trendColor = $derived.by(() => {
		if (trend === 'up') return 'text-salesforce-green-500';
		if (trend === 'down') return 'text-salesforce-red-500';
		return 'text-salesforce-gray-500';
	});

	const trendIcon = $derived.by(() => {
		if (trend === 'up') return ArrowUp;
		if (trend === 'down') return ArrowDown;
		return null;
	});
</script>

<Card class={`p-6 ${className}`}>
	<h3 class="text-lg font-medium text-salesforce-gray-600 mb-2">{title}</h3>
	<div class="flex items-end justify-between">
		<p class="text-4xl font-bold text-salesforce-gray-900 leading-none">
			{value}{unit}
		</p>
		{#if trend === 'up'}
			<div class="flex items-center gap-1 {trendColor}">
				<ArrowUp size={20} />
				{#if percentageChange}
					<span class="text-base font-semibold">{Math.abs(percentageChange).toFixed(1)}%</span>
				{/if}
			</div>
		{:else if trend === 'down'}
			<div class="flex items-center gap-1 {trendColor}">
				<ArrowDown size={20} />
				{#if percentageChange}
					<span class="text-base font-semibold">{Math.abs(percentageChange).toFixed(1)}%</span>
				{/if}
			</div>
		{/if}
	</div>
</Card>
