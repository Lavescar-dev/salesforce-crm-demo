<script lang="ts">
	import type { SelectOption } from '$lib/types';

	interface Props {
		id?: string;
		value?: string;
		options: SelectOption[];
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		optional?: boolean; // New prop
		class?: string;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		value = $bindable(''),
		options,
		placeholder = 'Select an option',
		disabled = false,
		required = false,
		optional = false, // Default to not optional
		class: className = '',
		onchange
	}: Props = $props();

	// If optional is true, then required should be false
	const isRequired = $derived(required && !optional);

	const classes = $derived(`w-full px-3 py-2 border border-salesforce-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-salesforce-blue-500 focus:border-transparent disabled:bg-salesforce-gray-100 disabled:cursor-not-allowed ${className}`);
</script>

<select {id} bind:value {disabled} required={isRequired} class={classes} {onchange}>
	{#if placeholder}
		<option value="" disabled selected>{placeholder}</option>
	{/if}
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
