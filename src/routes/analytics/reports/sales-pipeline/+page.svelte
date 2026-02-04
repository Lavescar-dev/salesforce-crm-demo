<script lang="ts">
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import MetricCard from '$lib/components/charts/MetricCard.svelte';
	import FunnelChart from '$lib/components/charts/FunnelChart.svelte';
	import DateRangeFilter from '$lib/components/data/DateRangeFilter.svelte';
	import { format, parseISO, isAfter, isBefore, subDays, addDays } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { Printer } from 'lucide-svelte';

	let startDate = $state(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
	let endDate = $state(format(new Date(), 'yyyy-MM-dd'));

	$effect(() => {
		opportunitiesStore.load();
	});

	const filteredOpportunities = $derived(() => {
		const start = parseISO(startDate);
		const end = parseISO(endDate);
		return opportunitiesStore.items.filter(opp => {
			const closeDate = parseISO(opp.closeDate);
			return isAfter(closeDate, subDays(start, 1)) && isBefore(closeDate, addDays(end, 1));
		});
	});

	const pipelineStages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Perception Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'];

	const pipelineData = $derived(() => {
		const dataMap: Record<string, number> = {};
		pipelineStages.forEach(stage => (dataMap[stage] = 0));

		filteredOpportunities.forEach(opp => {
			dataMap[opp.stage] += opp.amount;
		});

		const labels = pipelineStages;
		const data = pipelineStages.map(stage => dataMap[stage]);

		return {
			labels: labels,
			datasets: [
				{
					label: 'Opportunity Value',
					data: data,
					backgroundColor: [
						'rgba(54, 162, 235, 0.8)', // Blue for prospecting/proposal
						'rgba(255, 205, 86, 0.8)', // Yellow for qualification/needs analysis
						'rgba(255, 159, 64, 0.8)', // Orange for value proposition
						'rgba(75, 192, 192, 0.8)', // Teal
						'rgba(153, 102, 255, 0.8)', // Purple
						'rgba(201, 203, 207, 0.8)', // Gray
						'rgba(255, 99, 132, 0.8)', // Red
						'rgba(75, 192, 192, 0.8)', // Teal
						'rgba(54, 162, 235, 0.8)' // Blue
					]
				}
			]
		};
	});

	const totalPipelineValue = $derived(() => {
		return filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
	});

	const closedWonValue = $derived(() => {
		return filteredOpportunities.filter(opp => opp.stage === 'Closed Won').reduce((sum, opp) => sum + opp.amount, 0);
	});

	function handleDateRangeApply(newStartDate: string, newEndDate: string) {
		startDate = newStartDate;
		endDate = newEndDate;
	}

    function printReport() {
        window.print();
    }
</script>

<div class="max-w-7xl mx-auto print:max-w-full print:mx-0">
	<div class="mb-6 flex justify-between items-center print:block">
		<div>
			<h1 class="text-3xl font-bold text-salesforce-gray-900 print:text-black print:text-2xl print:mb-2">Sales Pipeline Report</h1>
			<p class="text-salesforce-gray-600 mt-1 print:text-gray-700 print:text-base">Visualize opportunities across different stages</p>
		</div>
		<Button onclick={printReport} class="print:hidden">
			<Printer size={16} class="mr-2" /> Print Report
		</Button>
	</div>

	<div class="mb-6 print:hidden">
		<DateRangeFilter bind:startDate bind:endDate onApply={handleDateRangeApply} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:block">
		<MetricCard title="Total Pipeline Value" value={formatters.currency(totalPipelineValue)} />
		<MetricCard title="Closed Won Value" value={formatters.currency(closedWonValue)} />
		<MetricCard title="Average Opportunity Value" value={formatters.currency(totalPipelineValue / filteredOpportunities.length || 0)} />
	</div>

	<Card class="p-6 print:p-0 print:border-none print:shadow-none">
		<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4 print:text-black print:text-lg print:mb-2">Opportunity Funnel by Value</h2>
		<div class="h-96 print:h-auto print:w-full">
			<FunnelChart data={pipelineData} />
		</div>
	</Card>
</div>

<style>
    @media print {
        body {
            background-color: #fff;
            color: #000;
        }
        /* Hide elements not relevant for print */
        .print\\:hidden {
            display: none !important;
        }
        /* Ensure charts print correctly */
        canvas {
            background-color: white;
            border: 1px solid #ccc;
        }
    }
</style>
