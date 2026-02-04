<script lang="ts">
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CaseForm from '$lib/components/service/CaseForm.svelte';
	import type { Case } from '$lib/types';

	function handleCaseSubmitted(caseItem: Case) {
		goto(`/service/cases/${caseItem.id}`);
	}

	function handleCancel() {
		goto('/service/cases');
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Case</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new service case</p>
	</div>

	<Card class="p-6">
		<CaseForm onSubmitted={handleCaseSubmitted} onCancel={handleCancel} />
	</Card>
</div>
