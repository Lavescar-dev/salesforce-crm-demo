<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { casesStore } from '$lib/stores/cases.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CaseForm from '$lib/components/service/CaseForm.svelte';
	import type { Case } from '$lib/types';

	const caseId = $page.params.id;
	let existingCase = casesStore.getById(caseId);

	if (!existingCase) {
		toastStore.error('Case not found!');
		goto('/service/cases');
	}

	function handleCaseSubmitted(caseItem: Case) {
		goto(`/service/cases/${caseItem.id}`);
	}

	function handleCancel() {
		goto(`/service/cases/${caseId}`);
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Case</h1>
		<p class="text-salesforce-gray-600 mt-1">Update case information</p>
	</div>

	<Card class="p-6">
		<CaseForm initialCase={existingCase} onSubmitted={handleCaseSubmitted} onCancel={handleCancel} />
	</Card>
</div>
