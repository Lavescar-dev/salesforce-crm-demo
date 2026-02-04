<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import CampaignForm from '$lib/components/marketing/CampaignForm.svelte';
	import type { Campaign } from '$lib/types';

	function handleCampaignSubmitted(campaign: Campaign) {
		goto(`/marketing/campaigns/${campaign.id}`);
	}

	function handleCancel() {
		goto('/marketing/campaigns');
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">New Campaign</h1>
		<p class="text-salesforce-gray-600 mt-1">Create a new marketing campaign</p>
	</div>

	<Card class="p-6">
		<CampaignForm onSubmitted={handleCampaignSubmitted} onCancel={handleCancel} />
	</Card>
</div>
