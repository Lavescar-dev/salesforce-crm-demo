<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';

	const iconMap = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertTriangle,
		info: Info
	};

	const colorMap = {
		success: 'bg-green-50 text-green-800 border-green-200',
		error: 'bg-red-50 text-red-800 border-red-200',
		warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
		info: 'bg-blue-50 text-blue-800 border-blue-200'
	};
</script>

<div class="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
	{#each toastStore.messages as toast (toast.id)}
		{@const Icon = iconMap[toast.type]}
		<div
			class="flex items-start gap-3 p-4 rounded-lg border shadow-lg {colorMap[toast.type]} min-w-[300px] max-w-md"
		>
			<Icon size={20} class="flex-shrink-0 mt-0.5" />
			<p class="flex-1 text-sm font-medium">{toast.message}</p>
			<button
				type="button"
				onclick={() => toastStore.dismiss(toast.id)}
				class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
			>
				<X size={16} />
			</button>
		</div>
	{/each}
</div>
