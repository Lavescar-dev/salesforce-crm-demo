<script lang="ts">
	interface Props {
		class?: string;
		children?: any;
	}

	let { class: className = '', children }: Props = $props();

	const classes = $derived(`bg-white rounded-lg shadow border border-salesforce-gray-200 ${className}`);
</script>

<div class={classes}>
	{@render children?.()}
</div>
