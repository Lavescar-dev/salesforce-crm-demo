<script lang="ts">
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import { formatters } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import MetricCard from '$lib/components/charts/MetricCard.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DateRangeFilter from '$lib/components/data/DateRangeFilter.svelte';
	import { format, parseISO, isAfter, isBefore, subDays, addDays } from 'date-fns';
	import Button from '$lib/components/ui/Button.svelte';
	import { Printer } from 'lucide-svelte';

	let startDate = $state(format(subDays(new Date(), 90), 'yyyy-MM-dd'));
	let endDate = $state(format(new Date(), 'yyyy-MM-dd'));

	$effect(() => {
		campaignsStore.load();
	});

	const filteredCampaigns = $derived(() => {
		const start = parseISO(startDate);
		const end = parseISO(endDate);
		return campaignsStore.items.filter(campaign => {
			const campaignStartDate = parseISO(campaign.startDate);
			const campaignEndDate = parseISO(campaign.endDate);
			return (isAfter(campaignStartDate, subDays(start, 1)) && isBefore(campaignStartDate, addDays(end, 1))) ||
			       (isAfter(campaignEndDate, subDays(start, 1)) && isBefore(campaignEndDate, addDays(end, 1))) ||
			       (isBefore(campaignStartDate, addDays(start, 1)) && isAfter(campaignEndDate, subDays(end, 1)));
		});
	});

	const campaignROIData = $derived(() => {
		const labels = filteredCampaigns.map(c => c.name);
		const roiValues = filteredCampaigns.map(c => {
			if (c.actualCost === 0) return 0;
			return ((c.revenue - c.actualCost) / c.actualCost) * 100;
		});

		return {
			labels: labels,
			datasets: [
				{
					label: 'Campaign ROI (%)',
					data: roiValues,
					backgroundColor: roiValues.map(roi => roi >= 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'),
					borderColor: roiValues.map(roi => roi >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
					borderWidth: 1
				}
			]
		};
	});

	const totalCampaigns = $derived(() => filteredCampaigns.length);
	const totalBudget = $derived(() => filteredCampaigns.reduce((sum, c) => sum + c.budget, 0));
	const totalRevenue = $derived(() => filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0));
	const averageROI = $derived(() => {
		const validROIs = campaignROIData.datasets[0].data.filter(roi => !isNaN(roi));
		if (validROIs.length === 0) return 0;
		const sumROI = validROIs.reduce((sum, roi) => sum + roi, 0);
		return sumROI / validROIs.length;
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
			<h1 class="text-3xl font-bold text-salesforce-gray-900 print:text-black print:text-2xl print:mb-2">Campaign ROI Report</h1>
			<p class="text-salesforce-gray-600 mt-1 print:text-gray-700 print:text-base">Analyze the return on investment for your campaigns</p>
		</div>
		<Button onclick={printReport} class="print:hidden">
			<Printer size={16} class="mr-2" /> Print Report
		</Button>
	</div>

	<div class="mb-6 print:hidden">
		<DateRangeFilter bind:startDate bind:endDate onApply={handleDateRangeApply} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 print:block">
		<MetricCard title="Total Campaigns" value={totalCampaigns} />
		<MetricCard title="Total Budget" value={formatters.currency(totalBudget)} />
		<MetricCard title="Total Revenue" value={formatters.currency(totalRevenue)} />
		<MetricCard title="Average ROI" value={`${averageROI.toFixed(2)}%`} trend={averageROI >= 0 ? 'up' : 'down'} />
	</div>

	<Card class="p-6 print:p-0 print:border-none print:shadow-none">
		<h2 class="text-lg font-semibold text-salesforce-gray-900 mb-4 print:text-black print:text-lg print:mb-2">Campaign ROI by Campaign</h2>
		<div class="h-96 print:h-auto print:w-full">
			<BarChart data={campaignROIData} />
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
