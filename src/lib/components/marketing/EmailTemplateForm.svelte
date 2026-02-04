<script lang="ts">
	import { emailTemplatesStore } from '$lib/stores/emailTemplates.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { EmailTemplate, SelectOption } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RichTextEditor from '$lib/components/forms/RichTextEditor.svelte';

	interface Props {
		initialTemplate?: EmailTemplate | null;
		onSubmitted: (template: EmailTemplate) => void;
		onCancel: () => void;
	}

	let { initialTemplate, onSubmitted, onCancel }: Props = $props();

	let formData = $state({
		name: initialTemplate?.name || '',
		subject: initialTemplate?.subject || '',
		htmlBody: initialTemplate?.htmlBody || '',
		category: initialTemplate?.category || 'Promotional'
	});

	const categoryOptions: SelectOption[] = [
		{ value: 'Promotional', label: 'Promotional' },
		{ value: 'Transactional', label: 'Transactional' },
		{ value: 'Welcome', label: 'Welcome' },
		{ value: 'Newsletter', label: 'Newsletter' },
		{ value: 'Follow-up', label: 'Follow-up' },
		{ value: 'Other', label: 'Other' }
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!formData.name || !formData.subject || !formData.htmlBody) {
			toastStore.error('Name, Subject, and HTML Body are required.');
			return;
		}

		if (initialTemplate) {
			// Update existing template
			try {
				const updatedTemplate = emailTemplatesStore.update(initialTemplate.id, {
					name: formData.name,
					subject: formData.subject,
					htmlBody: formData.htmlBody,
					category: formData.category
				});
				if (updatedTemplate) {
					toastStore.success('Email template updated successfully!');
					onSubmitted(updatedTemplate);
				} else {
					toastStore.error('Failed to update email template.');
				}
			} catch (error) {
				console.error('Error updating email template:', error);
				toastStore.error('Failed to update email template.');
			}
		} else {
			// Create new template
			try {
				const newTemplate = emailTemplatesStore.create({
					name: formData.name,
					subject: formData.subject,
					htmlBody: formData.htmlBody,
					category: formData.category
				});
				toastStore.success('Email template created successfully!');
				onSubmitted(newTemplate);
			} catch (error) {
				console.error('Error creating email template:', error);
				toastStore.error('Failed to create email template.');
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="name" class="form-label">Template Name *</label>
			<Input id="name" bind:value={formData.name} required />
		</div>
		<div>
			<label for="subject" class="form-label">Subject *</label>
			<Input id="subject" bind:value={formData.subject} required />
		</div>
		<div>
			<label for="category" class="form-label">Category</label>
			<Select id="category" bind:value={formData.category} options={categoryOptions} />
		</div>
	</div>

	<div>
		<label for="htmlBody" class="form-label">HTML Body *</label>
		<RichTextEditor id="htmlBody" bind:value={formData.htmlBody} required />
	</div>

	<div class="flex gap-3 justify-end">
		<Button type="button" variant="secondary" onclick={onCancel}>Cancel</Button>
		<Button type="submit" variant="primary">{initialTemplate ? 'Update Template' : 'Create Template'}</Button>
	</div>
</form>
