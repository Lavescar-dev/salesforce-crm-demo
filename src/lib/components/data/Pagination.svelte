<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, onPageChange }: Props = $props();

	const canGoPrevious = $derived(currentPage > 1);
	const canGoNext = $derived(currentPage < totalPages);

	function handlePrevious() {
		if (canGoPrevious) {
			onPageChange(currentPage - 1);
		}
	}

	function handleNext() {
		if (canGoNext) {
			onPageChange(currentPage + 1);
		}
	}
</script>

<div class="flex items-center justify-between border-t border-salesforce-gray-200 bg-white px-4 py-3 sm:px-6">
	<div class="flex flex-1 justify-between sm:hidden">
		<Button
			variant="secondary"
			size="sm"
			disabled={!canGoPrevious}
			onclick={handlePrevious}
		>
			Previous
		</Button>
		<Button
			variant="secondary"
			size="sm"
			disabled={!canGoNext}
			onclick={handleNext}
		>
			Next
		</Button>
	</div>
	<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
		<div>
			<p class="text-sm text-salesforce-gray-700">
				Page <span class="font-medium">{currentPage}</span> of <span class="font-medium">{totalPages}</span>
			</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant="secondary"
				size="sm"
				disabled={!canGoPrevious}
				onclick={handlePrevious}
			>
				<ChevronLeft size={16} />
				Previous
			</Button>
			<Button
				variant="secondary"
				size="sm"
				disabled={!canGoNext}
				onclick={handleNext}
			>
				Next
				<ChevronRight size={16} />
			</Button>
		</div>
	</div>
</div>
