<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { format, subDays } from 'date-fns';

	interface Props {
		startDate: string;
		endDate: string;
		onApply: (startDate: string, endDate: string) => void;
	}

	let { startDate, endDate, onApply }: Props = $props();

	let internalStartDate = $state(startDate);
	let internalEndDate = $state(endDate);

	$effect(() => {
		internalStartDate = startDate;
	});

	$effect(() => {
		internalEndDate = endDate;
	});

	function applyFilter() {
		onApply(internalStartDate, internalEndDate);
	}

	function setQuickRange(days: number) {
		internalEndDate = format(new Date(), 'yyyy-MM-dd');
		internalStartDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
		applyFilter();
	}
</script>

<div class="flex flex-wrap gap-3 p-4 border border-salesforce-gray-200 rounded-lg bg-white">
	<div class="flex-grow">
		<label for="startDate" class="sr-only">Start Date</label>
		<Input id="startDate" type="date" bind:value={internalStartDate} />
	</div>
	<div class="flex-grow">
		<label for="endDate" class="sr-only">End Date</label>
		<Input id="endDate" type="date" bind:value={internalEndDate} />
	</div>
	<Button variant="secondary" onclick={() => setQuickRange(7)}>Last 7 Days</Button>
	<Button variant="secondary" onclick={() => setQuickRange(30)}>Last 30 Days</Button>
	<Button variant="secondary" onclick={() => setQuickRange(90)}>Last 90 Days</Button>
	<Button variant="primary" onclick={applyFilter}>Apply</Button>
</div>
