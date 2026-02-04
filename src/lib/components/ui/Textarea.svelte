<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		rows?: number;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		rows = 4,
		disabled = false,
		required = false,
		class: className = '',
		oninput
	}: Props = $props();

	const classes = $derived(`w-full px-3 py-2 border border-salesforce-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-salesforce-blue-500 focus:border-transparent disabled:bg-salesforce-gray-100 disabled:cursor-not-allowed ${className}`);
</script>

<textarea
	bind:value
	{placeholder}
	{rows}
	{disabled}
	{required}
	class={classes}
	{oninput}
></textarea>
