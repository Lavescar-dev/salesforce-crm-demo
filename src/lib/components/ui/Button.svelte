<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
		title?: string;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		onclick,
		class: className = '',
		title,
		children
	}: Props = $props();

	const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const variantClasses = {
		primary: 'bg-salesforce-blue-500 text-white hover:bg-salesforce-blue-600 focus:ring-salesforce-blue-500',
		secondary: 'bg-white text-salesforce-gray-800 border border-salesforce-gray-300 hover:bg-salesforce-gray-50 focus:ring-salesforce-blue-500',
		destructive: 'bg-salesforce-red-500 text-white hover:bg-salesforce-red-600 focus:ring-salesforce-red-500',
		ghost: 'text-salesforce-gray-700 hover:bg-salesforce-gray-100 focus:ring-salesforce-blue-500'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`);
</script>

<button {type} class={classes} {disabled} {title} onclick={onclick}>
	{@render children?.()}
</button>
