<script lang="ts">
	import { leadsStore } from '$lib/stores/leads.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import MetricCard from '$lib/components/charts/MetricCard.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import DateRangeFilter from '$lib/components/data/DateRangeFilter.svelte';
	import { format, parseISO, isAfter, isBefore, subDays, addDays } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { Printer } from 'lucide-svelte';

	let startDate = $state(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
	let endDate = $state(format(new Date(), 'yyyy-MM-dd'));

	$effect(() => {
		leadsStore.load();
	});

	const filteredLeads = $derived(() => {
		const start = parseISO(startDate);
		const end = parseISO(endDate);
		return leadsStore.items.filter(lead => {
			const createdAt = parseISO(lead.createdAt);
			return isAfter(createdAt, subDays(start, 1)) && isBefore(createdAt, addDays(end, 1));
		});
	});

	const leadSourceData = $derived(() => {
		const sourceMap: Record<string, number> = {};
		filteredLeads.forEach(lead => {
			sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1;
		});

		const labels = Object.keys(sourceMap);
		const data = Object.values(sourceMap);

		return {
			labels: labels,
			datasets: [
				{
					label: 'Number of Leads',
					data: data,
					backgroundColor: [
						'rgba(54, 162, 235, 0.8)', // Blue
						'rgba(255, 205, 86, 0.8)', // Yellow
						'rgba(255, 99, 132, 0.8)', // Red
						'rgba(75, 192, 192, 0.8)', // Green
						'rgba(153, 102, 255, 0.8)' // Purple
					]
				}
			]
		};
	});

	const totalLeads = $derived(() => filteredLeads.length);
	const newLeads = $derived(() => filteredLeads.filter(lead => lead.status === 'New').length);
	const qualifiedLeads = $derived(() => filteredLeads.filter(lead => lead.status === 'Qualified').length);

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
			<h1 class="text-3xl font-bold text-salesforce-gray-900 print:text-black print:text-2xl print:mb-2">Lead Source Report</h1>
			<p class="text-salesforce-gray-600 mt-1 print:text-gray-700 print:text-base">Analyze the sources of your leads</p>
		</div>
		<Button onclick={printReport} class="print:hidden">
			<Printer size={16} class="mr-2" /> Print Report
		</Button>
	</div>

	<div class="mb-6 print:hidden">
		<DateRangeFilter bind:startDate bind:endDate onApply={handleDateRangeApply} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:block">
		<MetricCard title="Total Leads" value={totalLeads} />
		<MetricCard title="New Leads" value={newLeads} />
		<MetricCard title="Qualified Leads" value={qualifiedLeads} />
	</div>

	<Card class="p-6 print:p-0 print:border-none print:shadow-none">
		<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4 print:text-black print:text-lg print:mb-2">Leads by Source</h2>
		<div class="h-96 print:h-auto print:w-full">
			<PieChart data={leadSourceData} />
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
