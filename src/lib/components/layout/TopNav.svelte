<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { formatters } from '$lib/utils';
	import { Search, Bell, LogOut } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SearchBar from '$lib/components/data/SearchBar.svelte';
	import { debounce } from '$lib/utils/helpers';
	import { leadsStore } from '$lib/stores/leads.svelte';
	import { opportunitiesStore } from '$lib/stores/opportunities.svelte';
	import { accountsStore } from '$lib/stores/accounts.svelte';
	import { contactsStore } from '$lib/stores/contacts.svelte';
	import { casesStore } from '$lib/stores/cases.svelte';
	import { knowledgeArticlesStore } from '$lib/stores/knowledgeArticles.svelte';
	import { campaignsStore } from '$lib/stores/campaigns.svelte';
	import type { Lead, Opportunity, Account, Contact, Case, KnowledgeArticle, Campaign } from '$lib/types';
	import { onMount, onDestroy } from 'svelte';

	let showUserMenu = $state(false);
	let globalSearchTerm = $state('');
	let searchResults = $state<any[]>([]); // New state variable to hold search results
	let showSearchResults = $state(false);
	let searchAreaRef: HTMLDivElement; // Add a reference to the search area

	let showNotifications = $state(false); // New state for notifications
	let notifications = $state([
		{ id: 'notif1', message: 'New Lead assigned: John Doe', read: false, time: '2m ago' },
		{ id: 'notif2', message: 'Case #1234 updated to Working', read: false, time: '1h ago' },
		{ id: 'notif3', message: 'Campaign "Summer Sale" completed', read: true, time: '1d ago' }
	]);

	// Stores for all searchable entities
	const stores = [
		leadsStore,
		opportunitiesStore,
		accountsStore,
		contactsStore,
		casesStore,
		knowledgeArticlesStore,
		campaignsStore
	];

	// Load all store data on mount
	$effect(() => {
		stores.forEach(store => store.load());
	});

	// Debounced global search effect
	$effect(() => {
		if (globalSearchTerm.length > 2) { // Only search if term is long enough
			debounce(() => performGlobalSearch(globalSearchTerm), 300)();
			showSearchResults = true;
		} else {
			searchResults = []; // Clear results
			showSearchResults = false;
		}
	});

    onMount(() => {
        document.addEventListener('click', handleOutsideClick);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleOutsideClick);
    });

    function handleOutsideClick(event: MouseEvent) {
        if (searchAreaRef && !searchAreaRef.contains(event.target as Node)) {
            showSearchResults = false;
        }
    }

	function performGlobalSearch(term: string) {
		const lowerCaseTerm = term.toLowerCase();
		const results: any[] = []; // Store combined results

		// Search Leads
		leadsStore.items.forEach(lead => {
			if (lead.firstName.toLowerCase().includes(lowerCaseTerm) ||
				lead.lastName.toLowerCase().includes(lowerCaseTerm) ||
				lead.company.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...lead, entityType: 'Lead', url: `/sales/leads/${lead.id}` });
			}
		});

		// Search Opportunities
		opportunitiesStore.items.forEach(opp => {
			if (opp.name.toLowerCase().includes(lowerCaseTerm) ||
				opp.accountName?.toLowerCase().includes(lowerCaseTerm) ||
				opp.stage.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...opp, entityType: 'Opportunity', url: `/sales/opportunities/${opp.id}` });
			}
		});

		// Search Accounts
		accountsStore.items.forEach(account => {
			if (account.name.toLowerCase().includes(lowerCaseTerm) ||
				account.industry?.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...account, entityType: 'Account', url: `/sales/accounts/${account.id}` });
			}
		});

		// Search Contacts
		contactsStore.items.forEach(contact => {
			if (contact.firstName.toLowerCase().includes(lowerCaseTerm) ||
				contact.lastName.toLowerCase().includes(lowerCaseTerm) ||
				contact.email.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...contact, entityType: 'Contact', url: `/sales/contacts/${contact.id}` });
			}
		});

		// Search Cases
		casesStore.items.forEach(caseItem => {
			if (caseItem.subject.toLowerCase().includes(lowerCaseTerm) ||
				caseItem.description?.toLowerCase().includes(lowerCaseTerm) ||
				caseItem.caseNumber.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...caseItem, entityType: 'Case', url: `/service/cases/${caseItem.id}` });
			}
		});

		// Search Knowledge Articles
		knowledgeArticlesStore.items.forEach(article => {
			if (article.title.toLowerCase().includes(lowerCaseTerm) ||
				article.summary?.toLowerCase().includes(lowerCaseTerm) ||
				article.content?.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...article, entityType: 'Knowledge Article', url: `/service/knowledge/${article.id}` });
			}
		});

		// Search Campaigns
		campaignsStore.items.forEach(campaign => {
			if (campaign.name.toLowerCase().includes(lowerCaseTerm) ||
				campaign.description?.toLowerCase().includes(lowerCaseTerm)) {
				results.push({ ...campaign, entityType: 'Campaign', url: `/marketing/campaigns/${campaign.id}` });
			}
		});

		searchResults = results;
	}

	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
	}

	function handleLogout() {
		authStore.logout();
	}

	const userInitials = $derived(
		authStore.user
			? formatters.initials(authStore.user.firstName, authStore.user.lastName)
			: ''
	);
</script>

<header class="bg-white border-b border-salesforce-gray-200 px-6 py-3">
	<div class="flex items-center justify-between">
		<div class="flex-1 max-w-2xl relative">
			<SearchBar bind:value={globalSearchTerm} placeholder="Global Search..." />
			{#if showSearchResults && searchResults.length > 0}
				<div class="absolute z-10 w-full bg-white border border-salesforce-gray-200 rounded-b-lg shadow-lg mt-1 max-h-80 overflow-y-auto">
					{#each searchResults as result (result.id + result.entityType)}
						<a href={result.url} class="flex items-center gap-2 p-2 hover:bg-salesforce-gray-100 border-b border-salesforce-gray-100 last:border-b-0" onclick={() => showSearchResults = false}>
							<Badge variant="blue">{result.entityType}</Badge>
							<span class="text-sm font-medium text-salesforce-gray-900">{result.name || result.title || result.subject || `${result.firstName} ${result.lastName}`}</span>
						</a>
					{/each}
				</div>
			{:else if showSearchResults && searchResults.length === 0 && globalSearchTerm.length > 2}
				<div class="absolute z-10 w-full bg-white border border-salesforce-gray-200 rounded-b-lg shadow-lg mt-1 p-2 text-sm text-salesforce-gray-600">
					No results found for "{globalSearchTerm}"
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-4 ml-6">
            <div class="relative" bind:this={notificationsRef}>
                <button
                    type="button"
                    class="p-2 text-salesforce-gray-600 hover:text-salesforce-gray-900 hover:bg-salesforce-gray-100 rounded-lg transition-colors"
                    onclick={toggleNotifications}
                >
                    <Bell size={20} />
                    {#if notifications.filter(n => !n.read).length > 0}
                        <span class="absolute top-1 right-1 w-2 h-2 bg-salesforce-red-500 rounded-full"></span>
                    {/if}
                </button>

                {#if showNotifications}
                    <div
                        class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-salesforce-gray-200 py-1 z-50"
                    >
                        <div class="px-4 py-2 text-sm font-semibold text-salesforce-gray-900 border-b border-salesforce-gray-100">
                            Notifications
                        </div>
                        {#if notifications.length > 0}
                            {#each notifications as notification (notification.id)}
                                <div class="px-4 py-2 text-sm text-salesforce-gray-700 hover:bg-salesforce-gray-100 cursor-pointer"
                                     class:font-bold={!notification.read}>
                                    {notification.message}
                                    <span class="block text-xs text-salesforce-gray-500">{notification.time}</span>
                                </div>
                            {/each}
                        {:else}
                            <div class="px-4 py-2 text-sm text-salesforce-gray-600">No new notifications</div>
                        {/if}
                    </div>
                {/if}
            </div>

			<div class="relative">
				<button
					type="button"
					onclick={toggleUserMenu}
					class="flex items-center gap-3 px-3 py-2 hover:bg-salesforce-gray-100 rounded-lg transition-colors"
				>
					<div
						class="w-8 h-8 rounded-full bg-salesforce-blue-500 text-white flex items-center justify-center font-medium text-sm"
					>
						{userInitials}
					</div>
					<div class="text-left">
						<div class="text-sm font-medium text-salesforce-gray-900">
							{authStore.user?.firstName}
							{authStore.user?.lastName}
						</div>
						<div class="text-xs text-salesforce-gray-500 capitalize">
							{authStore.user?.role.replace('_', ' ')}
						</div>
					</div>
				</button>

				{#if showUserMenu}
					<div
						class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-salesforce-gray-200 py-1 z-50"
					>
						<button
							type="button"
							onclick={handleLogout}
							class="w-full flex items-center gap-2 px-4 py-2 text-sm text-salesforce-gray-700 hover:bg-salesforce-gray-100"
						>
							<LogOut size={16} />
							Logout
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
