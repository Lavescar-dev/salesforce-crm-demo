<script lang="ts">
	import { page } from '$app/stores';
	import { NAVIGATION } from '$lib/constants';
	import { Home, TrendingUp, Headset, Mail, BarChart } from 'lucide-svelte';

	const iconMap: Record<string, any> = {
		home: Home,
		'trending-up': TrendingUp,
		headset: Headset,
		mail: Mail,
		'bar-chart': BarChart
	};

	let expandedItems = $state<Set<string>>(new Set());

	function toggleExpand(href: string) {
		if (expandedItems.has(href)) {
			expandedItems.delete(href);
		} else {
			expandedItems.add(href);
		}
		expandedItems = new Set(expandedItems);
	}

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}
</script>

<aside class="w-64 bg-white border-r border-salesforce-gray-200 flex flex-col h-screen">
	<div class="p-6 border-b border-salesforce-gray-200">
		<h1 class="text-2xl font-bold text-salesforce-blue-500">Cirrus CRM</h1>
	</div>

	<nav class="flex-1 overflow-y-auto p-4">
		<ul class="space-y-1">
			{#each NAVIGATION as item}
				<li>
					{#if item.children && item.children.length > 0}
						<button
							type="button"
							onclick={() => toggleExpand(item.href)}
							class="w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg hover:bg-salesforce-gray-100 transition-colors {isActive(
								item.href
							)
								? 'text-salesforce-blue-600 bg-salesforce-blue-50'
								: 'text-salesforce-gray-700'}"
						>
							<span class="flex items-center gap-3">
								{#if item.icon && iconMap[item.icon]}
									{@const Icon = iconMap[item.icon]}
									<Icon size={20} />
								{/if}
								{item.label}
							</span>
							<svg
								class="w-4 h-4 transition-transform {expandedItems.has(item.href)
									? 'rotate-90'
									: ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>

						{#if expandedItems.has(item.href)}
							<ul class="mt-1 ml-4 space-y-1">
								{#each item.children as child}
									<li>
										<a
											href={child.href}
											class="block px-4 py-2 text-sm rounded-lg hover:bg-salesforce-gray-100 transition-colors {isActive(
												child.href
											)
												? 'text-salesforce-blue-600 bg-salesforce-blue-50 font-medium'
												: 'text-salesforce-gray-600'}"
										>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					{:else}
						<a
							href={item.href}
							class="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-salesforce-gray-100 transition-colors {isActive(
								item.href
							)
								? 'text-salesforce-blue-600 bg-salesforce-blue-50'
								: 'text-salesforce-gray-700'}"
						>
							{#if item.icon && iconMap[item.icon]}
								{@const Icon = iconMap[item.icon]}
								<Icon size={20} />
							{/if}
							{item.label}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</aside>
