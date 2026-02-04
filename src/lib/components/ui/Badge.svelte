<script lang="ts">
	interface Props {
		variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
		class?: string;
		children?: any;
	}

	let { variant = 'gray', class: className = '', children }: Props = $props();

	const variantClasses = {
		blue: 'bg-salesforce-blue-100 text-salesforce-blue-800',
		green: 'bg-green-100 text-green-800',
		yellow: 'bg-yellow-100 text-yellow-800',
		red: 'bg-red-100 text-red-800',
		gray: 'bg-salesforce-gray-100 text-salesforce-gray-800'
	};

	const classes = $derived(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`);
</script>

<span class={classes}>
	{@render children?.()}
</span>
