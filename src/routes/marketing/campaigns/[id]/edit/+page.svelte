<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CampaignForm from '$lib/components/marketing/CampaignForm.svelte';
	import type { Campaign } from '$lib/types';

	const campaignId = $page.params.id;
	let existingCampaign = campaignsStore.getById(campaignId);

	if (!existingCampaign) {
		toastStore.error('Campaign not found!');
		goto('/marketing/campaigns');
	}

	function handleCampaignSubmitted(campaign: Campaign) {
		goto(`/marketing/campaigns/${campaign.id}`);
	}

	function handleCancel() {
		goto(`/marketing/campaigns/${campaignId}`);
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-salesforce-gray-900">Edit Campaign</h1>
		<p class="text-salesforce-gray-600 mt-1">Update campaign information</p>
	</div>

	<Card class="p-6">
		<CampaignForm initialCampaign={existingCampaign} onSubmitted={handleCampaignSubmitted} onCancel={handleCancel} />
	</Card>
</div>
