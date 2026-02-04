<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Settings, X } from 'lucide-svelte';

	interface Props {
		title: string;
		onEdit?: () => void;
		onRemove?: () => void;
		children?: any;
	}

	let { title, onEdit, onRemove, children }: Props = $props();
</script>

<Card class="p-4 h-full flex flex-col">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-salesforce-gray-900">{title}</h3>
		<div class="flex gap-2">
			{#if onEdit}
				<Button variant="ghost" size="sm" onclick={onEdit} title="Edit Widget">
					<Settings size={16} />
				</Button>
			{/if}
			{#if onRemove}
				<Button variant="ghost" size="sm" onclick={onRemove} title="Remove Widget">
					<X size={16} />
				</Button>
			{/if}
		</div>
	</div>
	<div class="flex-grow">
		{@render children()}
	</div>
</Card>
