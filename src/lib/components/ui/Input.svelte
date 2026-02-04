<script lang="ts">
	interface Props {
		id?: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		class: className = '',
		oninput,
		onchange
	}: Props = $props();

	const classes = $derived(`w-full px-3 py-2 border border-salesforce-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-salesforce-blue-500 focus:border-transparent disabled:bg-salesforce-gray-100 disabled:cursor-not-allowed ${className}`);
</script>

<input
	{id}
	{type}
	bind:value
	{placeholder}
	{disabled}
	{required}
	class={classes}
	{oninput}
	{onchange}
/>
