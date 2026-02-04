<script lang="ts">
	import { casesStore } from '$lib/stores/cases.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import MetricCard from '$lib/components/charts/MetricCard.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DateRangeFilter from '$lib/components/data/DateRangeFilter.svelte';
	import { format, parseISO, isAfter, isBefore, subDays, addDays } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { Printer } from 'lucide-svelte';

	let startDate = $state(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
	let endDate = $state(format(new Date(), 'yyyy-MM-dd'));

	$effect(() => {
		casesStore.load();
	});

	const filteredCases = $derived(() => {
		const start = parseISO(startDate);
		const end = parseISO(endDate);
		return casesStore.items.filter(caseItem => {
			const createdAt = parseISO(caseItem.createdAt);
			return isAfter(createdAt, subDays(start, 1)) && isBefore(createdAt, addDays(end, 1));
		});
	});

	const caseStatusData = $derived(() => {
		const statusMap: Record<string, number> = {};
		filteredCases.forEach(caseItem => {
			statusMap[caseItem.status] = (statusMap[caseItem.status] || 0) + 1;
		});

		const labels = Object.keys(statusMap);
		const data = Object.values(statusMap);

		return {
			labels: labels,
			datasets: [
				{
					label: 'Number of Cases',
					data: data,
					backgroundColor: [
						'rgba(54, 162, 235, 0.8)', // New (Blue)
						'rgba(255, 205, 86, 0.8)', // Working (Yellow)
						'rgba(255, 99, 132, 0.8)', // Escalated (Red)
						'rgba(201, 203, 207, 0.8)', // On Hold (Gray)
						'rgba(75, 192, 192, 0.8)' // Closed (Green)
					]
				}
			]
		};
	});

	const casePriorityData = $derived(() => {
		const priorityMap: Record<string, number> = {};
		filteredCases.forEach(caseItem => {
			priorityMap[caseItem.priority] = (priorityMap[caseItem.priority] || 0) + 1;
		});

		const labels = Object.keys(priorityMap);
		const data = Object.values(priorityMap);

		return {
			labels: labels,
			datasets: [
				{
					label: 'Number of Cases',
					data: data,
					backgroundColor: [
						'rgba(75, 192, 192, 0.8)', // Low (Green)
						'rgba(255, 205, 86, 0.8)', // Medium (Yellow)
						'rgba(255, 159, 64, 0.8)', // High (Orange)
						'rgba(255, 99, 132, 0.8)' // Critical (Red)
					],
					borderColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(255, 205, 86, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(255, 99, 132, 1)'
					],
					borderWidth: 1
				}
			]
		};
	});

	const totalCases = $derived(() => filteredCases.length);
	const openCases = $derived(() => filteredCases.filter(caseItem => caseItem.status !== 'Closed').length);
	const closedCases = $derived(() => filteredCases.filter(caseItem => caseItem.status === 'Closed').length);

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
			<h1 class="text-3xl font-bold text-salesforce-gray-900 print:text-black print:text-2xl print:mb-2">Case Status Report</h1>
			<p class="text-salesforce-gray-600 mt-1 print:text-gray-700 print:text-base">Analyze the status and priority of your service cases</p>
		</div>
		<Button onclick={printReport} class="print:hidden">
			<Printer size={16} class="mr-2" /> Print Report
		</Button>
	</div>

	<div class="mb-6 print:hidden">
		<DateRangeFilter bind:startDate bind:endDate onApply={handleDateRangeApply} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:block">
		<MetricCard title="Total Cases" value={totalCases} />
		<MetricCard title="Open Cases" value={openCases} />
		<MetricCard title="Closed Cases" value={closedCases} />
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card class="p-6 print:p-0 print:border-none print:shadow-none">
			<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4 print:text-black print:text-lg print:mb-2">Cases by Status</h2>
			<div class="h-80 print:h-auto print:w-full">
				<PieChart data={caseStatusData} />
			</div>
		</Card>

		<Card class="p-6 print:p-0 print:border-none print:shadow-none">
			<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4 print:text-black print:text-lg print:mb-2">Cases by Priority</h2>
			<div class="h-80 print:h-auto print:w-full">
				<BarChart data={casePriorityData} />
			</div>
		</Card>
	</div>
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
