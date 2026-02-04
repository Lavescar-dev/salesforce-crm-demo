<script lang="ts">
	import { X } from 'lucide-svelte';

	interface Props {
		isOpen?: boolean;
		title?: string;
		onClose: () => void;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children?: any;
	}

	let { isOpen = false, title = '', onClose, size = 'md', children }: Props = $props();

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="bg-white rounded-lg shadow-xl w-full {sizeClasses[size]}">
			{#if title}
				<div class="flex items-center justify-between px-6 py-4 border-b border-salesforce-gray-200">
					<h2 class="text-xl font-semibold text-salesforce-gray-900">{title}</h2>
					<button
						type="button"
						onclick={onClose}
						class="text-salesforce-gray-400 hover:text-salesforce-gray-600 transition-colors"
					>
						<X size={24} />
					</button>
				</div>
			{/if}
			<div class="p-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
