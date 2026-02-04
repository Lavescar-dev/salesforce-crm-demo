<script lang="ts" generics="T">
	import { ChevronUp, ChevronDown } from 'lucide-svelte';
	import type { DataTableColumn } from '$lib/types';

	interface Props {
		data: T[];
		columns: DataTableColumn[];
		onRowClick?: (row: T) => void;
		sortField?: string;
		sortDirection?: 'asc' | 'desc';
		onSort?: (field: string) => void;
	}

	let {
		data,
		columns,
		onRowClick,
		sortField = '',
		sortDirection = 'asc',
		onSort
	}: Props = $props();

	function handleSort(column: DataTableColumn) {
		if (!column.sortable || !onSort) return;
		onSort(column.key);
	}

	function getCellValue(row: T, column: DataTableColumn): string {
		const value = (row as any)[column.key];
		if (column.render) {
			return column.render(value, row);
		}
		return value != null ? String(value) : '';
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-salesforce-gray-200">
		<thead class="bg-salesforce-gray-50">
			<tr>
				{#each columns as column}
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-salesforce-gray-700 uppercase tracking-wider {column.sortable
							? 'cursor-pointer hover:bg-salesforce-gray-100'
							: ''}"
						onclick={() => handleSort(column)}
					>
						<div class="flex items-center gap-1">
							{column.label}
							{#if column.sortable && sortField === column.key}
								{#if sortDirection === 'asc'}
									<ChevronUp size={14} />
								{:else}
									<ChevronDown size={14} />
								{/if}
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-salesforce-gray-200">
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="px-6 py-12 text-center text-salesforce-gray-500">
						No data available
					</td>
				</tr>
			{:else}
				{#each data as row}
					<tr
						class="{onRowClick
							? 'cursor-pointer hover:bg-salesforce-gray-50'
							: ''} transition-colors"
						onclick={() => onRowClick?.(row)}
					>
						{#each columns as column}
							<td class="px-6 py-4 whitespace-nowrap text-sm text-salesforce-gray-900">
								{@html getCellValue(row, column)}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
