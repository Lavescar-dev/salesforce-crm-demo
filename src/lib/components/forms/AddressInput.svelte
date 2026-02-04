<script lang="ts">
	import type { Address } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';

	interface Props {
		address: Address;
		prefix?: string; // Optional prefix for input IDs
		disabled?: boolean;
	}

	let { address, prefix = '', disabled = false }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4">
	<div>
		<label for="{prefix}street" class="form-label">Street</label>
		<Input id="{prefix}street" bind:value={address.street} {disabled} />
	</div>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div>
			<label for="{prefix}city" class="form-label">City</label>
			<Input id="{prefix}city" bind:value={address.city} {disabled} />
		</div>
		<div>
			<label for="{prefix}state" class="form-label">State</label>
			<Input id="{prefix}state" bind:value={address.state} {disabled} />
		</div>
		<div>
			<label for="{prefix}postalCode" class="form-label">Postal Code</label>
			<Input id="{prefix}postalCode" bind:value={address.postalCode} {disabled} />
		</div>
		<div>
			<label for="{prefix}country" class="form-label">Country</label>
			<Input id="{prefix}country" bind:value={address.country} {disabled} />
		</div>
	</div>
</div>
