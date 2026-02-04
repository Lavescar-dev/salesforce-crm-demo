<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { emailTemplatesStore } from '$lib/stores/emailTemplates.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import EmailTemplateForm from '$lib/components/marketing/EmailTemplateForm.svelte';
	import type { EmailTemplate } from '$lib/types';

	const templateId = $page.params.id;
	let existingTemplate = emailTemplatesStore.getById(templateId);

	if (!existingTemplate) {
		toastStore.error('Email Template not found!');
		goto('/marketing/email-templates');
	}

	function handleTemplateSubmitted(template: EmailTemplate) {
		goto(`/marketing/email-templates/${template.id}`);
	}

	function handleCancel() {
		goto(`/marketing/email-templates/${templateId}`);
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Email Template</h1>
		<p class="text-salesforce-gray-600 mt-1">Update email template information</p>
	</div>

	<Card class="p-6">
		<EmailTemplateForm initialTemplate={existingTemplate} onSubmitted={handleTemplateSubmitted} onCancel={handleCancel} />
	</Card>
</div>
