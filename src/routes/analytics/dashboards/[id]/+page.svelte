<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { dashboardsStore } from '$lib/stores/dashboards.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { formatters } from '$lib/utils';
	import type { Dashboard, Widget } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DashboardWidget from '$lib/components/analytics/DashboardWidget.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import FunnelChart from '$lib/components/charts/FunnelChart.svelte';
	import MetricCard from '$lib/components/charts/MetricCard.svelte';
	import { Edit, Trash2, ArrowLeft } from 'lucide-svelte';

	import { leadsStore } from '$lib/stores/leads.svelte';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { casesStore } from '$lib/stores/cases.svelte';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';

	const dashboardId = $derived($page.params.id);
	const dashboard = $derived(dashboardsStore.getById(dashboardId));

	let showDeleteModal = $state(false);

	$effect(() => {
		dashboardsStore.load();
		leadsStore.load();
		opportunitiesStore.load();
		casesStore.load();
		campaignsStore.load();
	});

	// Derived data for reports/charts
	const leadSourceData = $derived(() => {
		const sourceMap: Record<string, number> = {};
		leadsStore.items.forEach(lead => {
			sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1;
		});
		return {
			labels: Object.keys(sourceMap),
			datasets: [{
				label: 'Number of Leads',
				data: Object.values(sourceMap),
				backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 205, 86, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)']
			}]
		};
	});

	const salesPipelineData = $derived(() => {
		const pipelineStages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Perception Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'];
		const dataMap: Record<string, number> = {};
		pipelineStages.forEach(stage => (dataMap[stage] = 0));
		opportunitiesStore.items.forEach(opp => {
			dataMap[opp.stage] += opp.amount;
		});
		return {
			labels: pipelineStages,
			datasets: [{
				label: 'Opportunity Value',
				data: pipelineStages.map(stage => dataMap[stage]),
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
			}]
		};
	});

	const caseStatusData = $derived(() => {
		const statusMap: Record<string, number> = {};
		casesStore.items.forEach(caseItem => {
			statusMap[caseItem.status] = (statusMap[caseItem.status] || 0) + 1;
		});
		return {
			labels: Object.keys(statusMap),
			datasets: [{
				label: 'Number of Cases',
				data: Object.values(statusMap),
				backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 205, 86, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(201, 203, 207, 0.8)', 'rgba(75, 192, 192, 0.8)']
			}]
		};
	});

	const campaignROIData = $derived(() => {
		const labels = campaignsStore.items.map(c => c.name);
		const roiValues = campaignsStore.items.map(c => {
			if (c.actualCost === 0) return 0;
			return ((c.revenue - c.actualCost) / c.actualCost) * 100;
		});
		return {
			labels: labels,
			datasets: [{
				label: 'Campaign ROI (%)',
				data: roiValues,
				backgroundColor: roiValues.map(roi => roi >= 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)')
			}]
		};
	});


	function handleEdit() {
		goto(`/analytics/dashboards/${dashboardId}/edit`);
	}

	function handleDelete() {
		if (dashboardsStore.delete(dashboardId)) {
			toastStore.success('Dashboard deleted successfully!');
			goto('/analytics/dashboards');
		} else {
			toastStore.error('Failed to delete dashboard');
		}
	}
</script>

{#if !dashboard}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Dashboard not found</p>
			<Button variant="secondary" onclick={() => goto('/analytics/dashboards')} class="mt-4">
				Back to Dashboards
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-full mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto('/analytics/dashboards')} class="mb-4">
				<ArrowLeft size={16} />
				Back to Dashboards
			</Button>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold text-salesforce-gray-900">
						{dashboard.name}
					</h1>
					<p class="text-salesforce-gray-600 mt-1">
						{dashboard.isPublic ? 'Public Dashboard' : 'Private Dashboard'}
					</p>
				</div>
				<div class="flex gap-2">
					<Button variant="secondary" onclick={handleEdit}>
						<Edit size={16} />
						Edit
					</Button>
					<Button variant="destructive" onclick={() => (showDeleteModal = true)}>
						<Trash2 size={16} />
						Delete
					</Button>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each dashboard.widgets as widget (widget.id)}
				<DashboardWidget title={widget.title}>
					{#if widget.widgetType === 'metric'}
						<MetricCard title={widget.title} value={widget.dataSource === 'leads' ? leadsStore.items.length :
																widget.dataSource === 'opportunities' ? formatters.currency(opportunitiesStore.items.reduce((sum, opp) => sum + opp.amount, 0)) :
																widget.dataSource === 'cases' ? casesStore.items.length :
																widget.dataSource === 'campaigns' ? campaignsStore.items.length : 'N/A'} />
					{:else if widget.widgetType === 'bar'}
						<BarChart data={widget.dataSource === 'opportunities' ? salesPipelineData :
										widget.dataSource === 'cases' ? caseStatusData :
										widget.dataSource === 'campaigns' ? campaignROIData : { labels: [], datasets: [] }} />
					{:else if widget.widgetType === 'pie'}
						<PieChart data={widget.dataSource === 'leads' ? leadSourceData :
										widget.dataSource === 'cases' ? caseStatusData : { labels: [], datasets: [] }} />
					{:else if widget.widgetType === 'line'}
						<LineChart data={campaignROIData} />
					{:else if widget.widgetType === 'funnel'}
						<FunnelChart data={salesPipelineData} />
					{/if}
				</DashboardWidget>
			{/each}
		</div>
	</div>

	<Modal isOpen={showDeleteModal} title="Delete Dashboard" onClose={() => (showDeleteModal = false)}>
		<div class="space-y-4">
			<p class="text-salesforce-gray-700">
				Are you sure you want to delete this dashboard? This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</div>
		</div>
	</Modal>
{/if}
