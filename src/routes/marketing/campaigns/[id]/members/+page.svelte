<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CampaignMemberList from '$lib/components/marketing/CampaignMemberList.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	const campaignId = $derived($page.params.id);
	const campaign = $derived(campaignsStore.getById(campaignId));

	if (!campaign) {
		toastStore.error('Campaign not found!');
		goto('/marketing/campaigns');
	}
</script>

{#if !campaign}
	<div class="max-w-4xl mx-auto">
		<Card class="p-8 text-center">
			<p class="text-salesforce-gray-600">Campaign not found</p>
			<Button variant="secondary" onclick={() => goto('/marketing/campaigns')} class="mt-4">
				Back to Campaigns
			</Button>
		</Card>
	</div>
{:else}
	<div class="max-w-7xl mx-auto">
		<div class="mb-6">
			<Button variant="ghost" onclick={() => goto(`/marketing/campaigns/${campaignId}`)} class="mb-4">
				<ArrowLeft size={16} />
				Back to Campaign Detail
			</Button>
			<h1 class="text-3xl font-bold text-salesforce-gray-900">
				Campaign Members: {campaign.name}
			</h1>
			<p class="text-salesforce-gray-600 mt-1">Manage leads and contacts for this campaign</p>
		</div>

		<Card class="p-4">
			<CampaignMemberList campaignId={campaignId} />
		</Card>
	</div>
{/if}
