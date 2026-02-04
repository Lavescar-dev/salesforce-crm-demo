<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Sidebar from './Sidebar.svelte';
	import TopNav from './TopNav.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();

	// Redirect to login if not authenticated
	$effect(() => {
		if (!authStore.isAuthenticated && $page.url.pathname !== '/login') {
			goto('/login');
		}
	});
</script>

<Toast />

{#if authStore.isAuthenticated}
	<div class="flex h-screen overflow-hidden">
		<Sidebar />
		<div class="flex-1 flex flex-col overflow-hidden">
			<TopNav />
			<main class="flex-1 overflow-auto bg-salesforce-gray-50 p-6">
				{@render children?.()}
			</main>
		</div>
	</div>
{:else if $page.url.pathname === '/login'}
	{@render children?.()}
{/if}
