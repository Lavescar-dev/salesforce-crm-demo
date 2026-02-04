<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;

		const result = await authStore.login({ email, password });

		if (result.success) {
			toastStore.success('Login successful!');
			goto('/');
		} else {
			toastStore.error(result.error || 'Login failed');
		}

		isLoading = false;
	}

	// Redirect if already logged in
	$effect(() => {
		if (authStore.isAuthenticated) {
			goto('/');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-salesforce-gray-100 px-4">
	<Card class="w-full max-w-md p-8">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-salesforce-blue-500 mb-2">Cirrus CRM</h1>
			<p class="text-salesforce-gray-600">Sign in to your account</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="email" class="form-label">Email</label>
				<Input
					id="email"
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
				/>
			</div>

			<div>
				<label for="password" class="form-label">Password</label>
				<Input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
					required
				/>
			</div>

			<Button type="submit" variant="primary" class="w-full" disabled={isLoading}>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>

		<div class="mt-8 pt-6 border-t border-salesforce-gray-200">
			<p class="text-sm text-salesforce-gray-600 mb-3">Demo Accounts:</p>
			<div class="space-y-2 text-xs text-salesforce-gray-500">
				<div>
					<strong>Admin:</strong> admin@demo.com / admin123
				</div>
				<div>
					<strong>Sales Rep:</strong> sales@demo.com / sales123
				</div>
				<div>
					<strong>Service Agent:</strong> service@demo.com / service123
				</div>
				<div>
					<strong>Marketing:</strong> marketing@demo.com / marketing123
				</div>
			</div>
		</div>
	</Card>
</div>
