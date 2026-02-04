<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import EmailTemplateForm from '$lib/components/marketing/EmailTemplateForm.svelte';
	import type { EmailTemplate } from '$lib/types';

	function handleTemplateSubmitted(template: EmailTemplate) {
		goto(`/marketing/email-templates/${template.id}`);
	}

	function handleCancel() {
		goto('/marketing/email-templates');
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Email Template</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new email template</p>
	</div>

	<Card class="p-6">
		<EmailTemplateForm onSubmitted={handleTemplateSubmitted} onCancel={handleCancel} />
	</Card>
</div>
