<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { TrendingUp, Users, Headset, Mail, Download, Upload } from 'lucide-svelte'; // Add Download, Upload icons
	import { STORAGE_KEYS } from '$lib/constants';
	import { toastStore } from '$lib/stores/toast.svelte';

	const quickLinks = [
		{
			title: 'Sales',
			description: 'Manage leads, opportunities, and accounts',
			icon: TrendingUp,
			href: '/sales/leads',
			color: 'bg-blue-500'
		},
		{
			title: 'Service',
			description: 'Handle cases and knowledge base',
			icon: Headset,
			href: '/service/cases',
			color: 'bg-purple-500'
		},
		{
			title: 'Marketing',
			description: 'Create campaigns and email templates',
			icon: Mail,
			href: '/marketing/campaigns',
			color: 'bg-green-500'
		},
		{
			title: 'Analytics',
			description: 'View dashboards and reports',
			icon: Users,
			href: '/analytics/dashboards',
			color: 'bg-orange-500'
		}
	];

    function handleExportData() {
        const data: { [key: string]: string | null } = {};
        for (const key in localStorage) {
            if (key.startsWith('crm_')) { // Assuming all app-related data starts with 'crm_'
                data[key] = localStorage.getItem(key);
            }
        }
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `salesforce-crm-demo-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toastStore.success('Data exported successfully!');
    }

    async function handleImportData(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            toastStore.error('No file selected for import.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                if (typeof importedData !== 'object' || importedData === null) {
                    toastStore.error('Invalid JSON file format.');
                    return;
                }

                // Clear existing crm_ data
                for (const key in localStorage) {
                    if (key.startsWith('crm_')) {
                        localStorage.removeItem(key);
                    }
                }

                // Import new data
                for (const key in importedData) {
                    if (key.startsWith('crm_') && importedData[key] !== null) {
                        localStorage.setItem(key, importedData[key]);
                    }
                }
                toastStore.success('Data imported successfully! Please refresh the page.');
                // Optionally: Reload the page to ensure all stores are re-initialized with new data
                // window.location.reload(); 
            } catch (error) {
                console.error('Error importing data:', error);
                toastStore.error('Failed to import data. Invalid JSON or corrupted file.');
            }
        };
        reader.readAsText(file);
    }
</script>

<div class="max-w-7xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-salesforce-gray-900 mb-2">
			Welcome back, {authStore.user?.firstName}!
		</h1>
		<p class="text-salesforce-gray-600">
			Here's what's happening with your CRM today.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each quickLinks as link}
			{@const Icon = link.icon}
			<a href={link.href} class="block group">
				<Card class="p-6 hover:shadow-lg transition-shadow">
					<div class="flex items-start gap-4">
						<div class="{link.color} text-white p-3 rounded-lg">
							<Icon size={24} />
						</div>
						<div class="flex-1">
							<h3
								class="font-semibold text-salesforce-gray-900 mb-1 group-hover:text-salesforce-blue-600 transition-colors"
							>
								{link.title}
							</h3>
							<p class="text-sm text-salesforce-gray-600">{link.description}</p>
						</div>
					</div>
				</Card>
			</a>
		{/each}
	</div>

	<div class="mt-12">
		<h2 class="text-2xl font-bold text-salesforce-gray-900 mb-6">Getting Started</h2>
		<Card class="p-6">
			<div class="prose max-w-none">
				<p class="text-salesforce-gray-700 mb-4">
					This is a full-featured Cirrus CRM demo built with SvelteKit 2.x and Svelte 5.
					All data is stored locally in your browser using LocalStorage.
				</p>
				<ul class="space-y-2 text-salesforce-gray-700">
					<li>
						<strong>Sales Cloud:</strong> Manage leads, opportunities, accounts, contacts, and
						activities
					</li>
					<li>
						<strong>Service Cloud:</strong> Handle customer cases and maintain a knowledge base
					</li>
					<li>
						<strong>Marketing:</strong> Create and track campaigns with ROI calculations
					</li>
					<li>
						<strong>Analytics:</strong> Build custom dashboards and view pre-built reports
					</li>
				</ul>
                <div class="mt-6 flex flex-wrap gap-4">
                    <Button onclick={handleExportData}>
                        <Download size={16} class="mr-2" /> Export Data (JSON)
                    </Button>
                    <label for="import-data" class="btn btn-secondary cursor-pointer">
                        <Upload size={16} class="mr-2" /> Import Data (JSON)
                        <input type="file" id="import-data" accept=".json" onchange={handleImportData} class="hidden" />
                    </label>
                </div>
			</div>
		</Card>
	</div>
</div>
