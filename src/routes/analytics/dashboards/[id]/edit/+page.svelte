<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { dashboardsStore } from '$lib/stores/dashboards.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DashboardBuilder from '$lib/components/analytics/DashboardBuilder.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	const dashboardId = $page.params.id;
	const dashboard = $derived(dashboardsStore.getById(dashboardId));

	if (!dashboard) {
		toastStore.error('Dashboard not found!');
		goto('/analytics/dashboards');
	}
</script>

<div class="max-w-7xl mx-auto">
	<div class="mb-6">
		<Button variant="ghost" onclick={() => goto(`/analytics/dashboards/${dashboardId}`)} class="mb-4">
			<ArrowLeft size={16} />
			Back to Dashboard
		</Button>
		<h1 class="text-3xl font-bold text-salesforce-gray-900">
			Edit Dashboard: {dashboard.name}
		</h1>
		<p class="text-salesforce-gray-600 mt-1">Add, remove, and rearrange widgets on your dashboard</p>
	</div>

	<Card class="p-6">
		<DashboardBuilder {dashboard} />
	</Card>
</div>
