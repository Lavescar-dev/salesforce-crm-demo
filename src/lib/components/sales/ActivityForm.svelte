<script lang="ts">
	import { activitiesStore } from '$lib/stores/activities.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Activity, SelectOption } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	interface Props {
		relatedToId: string;
		relatedToType: 'Lead' | 'Opportunity' | 'Account' | 'Contact';
		onActivityCreated?: (activity: Activity) => void;
		onCancel?: () => void;
	}

	let { relatedToId, relatedToType, onActivityCreated, onCancel }: Props = $props();

	let formData = $state({
		subject: '',
		description: '',
		type: 'Task' as Activity['type'],
		status: 'Open' as Activity['status']
	});

	const activityTypeOptions: SelectOption[] = [
		{ value: 'Task', label: 'Task' },
		{ value: 'Call', label: 'Call' },
		{ value: 'Email', label: 'Email' },
		{ value: 'Meeting', label: 'Meeting' },
		{ value: 'Note', label: 'Note' }
	];

	const activityStatusOptions: SelectOption[] = [
		{ value: 'Open', label: 'Open' },
		{ value: 'Completed', label: 'Completed' },
		{ value: 'In Progress', label: 'In Progress' },
		{ value: 'Deferred', label: 'Deferred' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!formData.subject) {
			toastStore.error('Activity subject is required.');
			return;
		}

		try {
			const newActivity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> = {
				subject: formData.subject,
				description: formData.description,
				type: formData.type,
				status: formData.status,
				relatedToId: relatedToId,
				relatedToType: relatedToType,
				ownerId: authStore.user?.id
			};

			const activity = activitiesStore.create(newActivity);
			toastStore.success('Activity created successfully!');
			onActivityCreated?.(activity); // Notify parent component
			resetForm();
		} catch (error) {
			console.error('Error creating activity:', error);
			toastStore.error('Failed to create activity.');
		}
	}

	function resetForm() {
		formData.subject = '';
		formData.description = '';
		formData.type = 'Task';
		formData.status = 'Open';
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4 p-4 border border-salesforce-gray-200 rounded-lg bg-white">
	<div>
		<label for="activitySubject" class="form-label">Subject *</label>
		<Input id="activitySubject" bind:value={formData.subject} required />
	</div>
	<div>
		<label for="activityType" class="form-label">Type</label>
		<Select id="activityType" bind:value={formData.type} options={activityTypeOptions} />
	</div>
	<div>
		<label for="activityStatus" class="form-label">Status</label>
		<Select id="activityStatus" bind:value={formData.status} options={activityStatusOptions} />
	</div>
	<div>
		<label for="activityDescription" class="form-label">Description</label>
		<Textarea id="activityDescription" bind:value={formData.description} rows={3} />
	</div>
	<div class="flex gap-3 justify-end">
		{#if onCancel}
			<Button type="button" variant="secondary" onclick={onCancel}>Cancel</Button>
		{/if}
		<Button type="submit" variant="primary">Log Activity</Button>
	</div>
</form>
