<script lang="ts">
	import { Search } from 'lucide-svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		onSearch: (value: string) => void;
	}

	let { value = $bindable(''), placeholder = 'Search...', onSearch }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onSearch(value);
	}
</script>

<div class="relative">
	<Search size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-salesforce-gray-400" />
	<input
		type="search"
		{placeholder}
		{value}
		oninput={handleInput}
		class="w-full pl-10 pr-4 py-2 border border-salesforce-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salesforce-blue-500 focus:border-transparent"
	/>
</div>
