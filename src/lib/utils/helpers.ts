import type { BaseEntity } from '$lib/types';

export function sortBy<T>(
	items: T[],
	field: keyof T,
	direction: 'asc' | 'desc' = 'asc'
): T[] {
	return [...items].sort((a, b) => {
		const aVal = a[field];
		const bVal = b[field];

		if (aVal === bVal) return 0;

		let comparison = 0;
		if (typeof aVal === 'string' && typeof bVal === 'string') {
			comparison = aVal.localeCompare(bVal);
		} else if (typeof aVal === 'number' && typeof bVal === 'number') {
			comparison = aVal - bVal;
		} else {
			comparison = String(aVal).localeCompare(String(bVal));
		}

		return direction === 'asc' ? comparison : -comparison;
	});
}

export function filterBy<T>(
	items: T[],
	filters: Partial<Record<keyof T, any>>
): T[] {
	return items.filter((item) => {
		return Object.entries(filters).every(([key, value]) => {
			if (value === null || value === undefined || value === '') return true;
			const itemValue = item[key as keyof T];

			if (typeof value === 'string' && typeof itemValue === 'string') {
				return itemValue.toLowerCase().includes(value.toLowerCase());
			}

			return itemValue === value;
		});
	});
}

export function searchItems<T>(
	items: T[],
	searchTerm: string,
	searchFields: (keyof T)[]
): T[] {
	if (!searchTerm.trim()) return items;

	const term = searchTerm.toLowerCase();
	return items.filter((item) => {
		return searchFields.some((field) => {
			const value = item[field];
			return String(value).toLowerCase().includes(term);
		});
	});
}

export function paginate<T>(
	items: T[],
	page: number,
	pageSize: number
): { items: T[]; totalPages: number; currentPage: number } {
	const totalPages = Math.ceil(items.length / pageSize);
	const currentPage = Math.max(1, Math.min(page, totalPages));
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	return {
		items: items.slice(startIndex, endIndex),
		totalPages,
		currentPage
	};
}

export function debounce<T extends (...args: any[]) => void>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

export function generateCaseNumber(): string {
	const timestamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).substr(2, 4).toUpperCase();
	return `CASE-${timestamp}${random}`;
}

export function calculateROI(revenue: number, cost: number): number {
	if (cost === 0) return 0;
	return ((revenue - cost) / cost) * 100;
}

export function groupBy<T>(
	items: T[],
	key: keyof T
): Record<string, T[]> {
	return items.reduce((groups, item) => {
		const groupKey = String(item[key]);
		if (!groups[groupKey]) {
			groups[groupKey] = [];
		}
		groups[groupKey].push(item);
		return groups;
	}, {} as Record<string, T[]>);
}
