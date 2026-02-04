<script lang="ts">
	import { dashboardsStore } from '$lib/stores/dashboards.svelte';
	import type { Dashboard, DashboardWidget } from '$lib/types';
	import DashboardWidgetComponent from '$lib/components/analytics/DashboardWidget.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { Plus, GripVertical } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action'; // Changed from @thisux/sveltednd to svelte-dnd-action

	interface Props {
		dashboard: Dashboard;
	}

	let { dashboard }: Props = $props();

	let showAddWidgetModal = $state(false);
	let newWidgetTitle = $state('New Widget');
	let newWidgetType = $state<'bar' | 'pie' | 'line' | 'funnel' | 'metric'>('metric');
	let newWidgetDataSource = $state<'leads' | 'opportunities' | 'cases' | 'campaigns'>('leads');

	const widgetTypeOptions = [
		{ value: 'metric', label: 'Metric Card' },
		{ value: 'bar', label: 'Bar Chart' },
		{ value: 'pie', label: 'Pie Chart' },
		{ value: 'line', label: 'Line Chart' },
		{ value: 'funnel', label: 'Funnel Chart' }
	];

	const dataSourceOptions = [
		{ value: 'leads', label: 'Leads' },
		{ value: 'opportunities', label: 'Opportunities' },
		{ value: 'cases', label: 'Cases' },
		{ value: 'campaigns', label: 'Campaigns' }
	];

	function handleAddWidget() {
		if (!newWidgetTitle.trim()) {
			toastStore.error('Widget title is required.');
			return;
		}

		const newWidget: DashboardWidget = {
			id: `widget_${Date.now()}`,
			title: newWidgetTitle,
			type: newWidgetType,
			dataSource: newWidgetDataSource,
			config: {},
			position: { x: 0, y: 0, w: 4, h: 3 }
		};

		const updatedWidgets = [...dashboard.widgets, newWidget];
		dashboardsStore.update(dashboard.id, { widgets: updatedWidgets });

		toastStore.success('Widget added to dashboard!');
		resetAddWidgetForm();
		showAddWidgetModal = false;
	}

	function handleRemoveWidget(widgetId: string) {
		if (confirm('Are you sure you want to remove this widget?')) {
			const updatedWidgets = dashboard.widgets.filter((widget) => widget.id !== widgetId);
			dashboardsStore.update(dashboard.id, { widgets: updatedWidgets });
			toastStore.success('Widget removed successfully!');
		}
	}

	function handleDndFinalize(event: CustomEvent<{ items: DashboardWidget[] }>) {
		const newWidgetOrder = event.detail.items;
		dashboardsStore.update(dashboard.id, { widgets: newWidgetOrder });
		toastStore.success('Widgets reordered!');
	}

	function resetAddWidgetForm() {
		newWidgetTitle = 'New Widget';
		newWidgetType = 'metric';
		newWidgetDataSource = 'leads';
	}
</script>

<div class="space-y-6">
	<div class="flex justify-end">
		<Button onclick={() => (showAddWidgetModal = true)}>
			<Plus size={16} class="mr-1" /> Add Widget
		</Button>
	</div>

	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		use:dndzone={{ items: dashboard.widgets, flipDurationMs: 100 }}
		on:finalize={handleDndFinalize}
		on:consider={handleDndFinalize}
	>
		{#each dashboard.widgets as widget (widget.id)}
			<div class="relative group">
				<DashboardWidgetComponent title={widget.title} onRemove={() => handleRemoveWidget(widget.id)}>
					<!-- Widget content will be rendered on the view page -->
					<div class="h-full flex items-center justify-center text-salesforce-gray-400">
						Widget Preview
					</div>
				</DashboardWidgetComponent>
				<div class="absolute top-2 right-12 text-salesforce-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
					<GripVertical />
				</div>
			</div>
		{/each}
	</div>
</div>

<Modal isOpen={showAddWidgetModal} title="Add Widget" onClose={() => (showAddWidgetModal = false)}>
	<div class="space-y-4">
		<div>
			<label for="widgetTitle" class="form-label">Widget Title *</label>
			<Input id="widgetTitle" bind:value={newWidgetTitle} required />
		</div>
		<div>
			<label for="widgetType" class="form-label">Widget Type</label>
			<Select id="widgetType" bind:value={newWidgetType} options={widgetTypeOptions} />
		</div>
		<div>
			<label for="dataSource" class="form-label">Data Source</label>
			<Select id="dataSource" bind:value={newWidgetDataSource} options={dataSourceOptions} />
		</div>
		<div class="flex gap-3 justify-end">
			<Button type="button" variant="secondary" onclick={() => (showAddWidgetModal = false)}>Cancel</Button>
			<Button type="button" variant="primary" onclick={handleAddWidget}>Add Widget</Button>
		</div>
	</div>
</Modal>
