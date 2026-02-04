<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { STORAGE_KEYS, CURRENT_DATA_VERSION } from '$lib/constants';
	import { storage, StorageManager } from '$lib/utils';
	import { initializeSeedData } from '$lib/utils/seedData';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	let { children } = $props();

	// Initialize seed data on first load
	if (browser) {
		const isInitialized = storage.get(STORAGE_KEYS.INIT_FLAG, false);
		const dataVersion = storage.get(STORAGE_KEYS.DATA_VERSION, '');

		if (!isInitialized || dataVersion !== CURRENT_DATA_VERSION) {
			const seedData = initializeSeedData();

			// Save all seed data to storage
			const managers = {
				leads: new StorageManager(STORAGE_KEYS.LEADS),
				accounts: new StorageManager(STORAGE_KEYS.ACCOUNTS),
				opportunities: new StorageManager(STORAGE_KEYS.OPPORTUNITIES),
				contacts: new StorageManager(STORAGE_KEYS.CONTACTS),
				activities: new StorageManager(STORAGE_KEYS.ACTIVITIES),
				cases: new StorageManager(STORAGE_KEYS.CASES),
				knowledgeArticles: new StorageManager(STORAGE_KEYS.KNOWLEDGE_ARTICLES),
				campaigns: new StorageManager(STORAGE_KEYS.CAMPAIGNS),
				campaignMembers: new StorageManager(STORAGE_KEYS.CAMPAIGN_MEMBERS),
				emailTemplates: new StorageManager(STORAGE_KEYS.EMAIL_TEMPLATES)
			};

			// Clear existing data and save seed data
			Object.keys(managers).forEach((key) => {
				const manager = managers[key as keyof typeof managers];
				manager.deleteAll();
			});

			// Save seed data directly to localStorage
			localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(seedData.leads));
			localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(seedData.accounts));
			localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(seedData.opportunities));
			localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(seedData.contacts));
			localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(seedData.activities));
			localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(seedData.cases));
			localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_ARTICLES, JSON.stringify(seedData.knowledgeArticles));
			localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(seedData.campaigns));
			localStorage.setItem(STORAGE_KEYS.CAMPAIGN_MEMBERS, JSON.stringify(seedData.campaignMembers));
			localStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(seedData.emailTemplates));

			// Mark as initialized
			storage.set(STORAGE_KEYS.INIT_FLAG, true);
			storage.set(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
		}
	}
</script>

<svelte:head>
	<title>Cirrus CRM</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<AppShell>
	{@render children()}
</AppShell>
