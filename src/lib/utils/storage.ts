import type { BaseEntity } from '$lib/types';

export class StorageManager<T extends BaseEntity> {
	private key: string;

	constructor(storageKey: string) {
		this.key = storageKey;
	}

	getAll(): T[] {
		try {
			const data = localStorage.getItem(this.key);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error(`Error reading from localStorage (${this.key}):`, error);
			return [];
		}
	}

	getById(id: string): T | null {
		const items = this.getAll();
		return items.find((item) => item.id === id) || null;
	}

	create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
		const items = this.getAll();
		const newItem = {
			...item,
			id: this.generateId(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		} as T;

		items.push(newItem);
		this.saveAll(items);
		return newItem;
	}

	update(id: string, updates: Partial<T>): T | null {
		const items = this.getAll();
		const index = items.findIndex((item) => item.id === id);

		if (index === -1) return null;

		items[index] = {
			...items[index],
			...updates,
			id, // Preserve ID
			updatedAt: new Date().toISOString()
		};

		this.saveAll(items);
		return items[index];
	}

	delete(id: string): boolean {
		const items = this.getAll();
		const filteredItems = items.filter((item) => item.id !== id);

		if (filteredItems.length === items.length) return false;

		this.saveAll(filteredItems);
		return true;
	}

	deleteAll(): void {
		this.saveAll([]);
	}

	search(predicate: (item: T) => boolean): T[] {
		return this.getAll().filter(predicate);
	}

	count(): number {
		return this.getAll().length;
	}

	private saveAll(items: T[]): void {
		try {
			localStorage.setItem(this.key, JSON.stringify(items));
		} catch (error) {
			if (error instanceof Error && error.name === 'QuotaExceededError') {
				console.error('LocalStorage quota exceeded');
				throw new Error(
					'Storage quota exceeded. Please clear some data or contact support.'
				);
			}
			throw error;
		}
	}

	private generateId(): string {
		return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}

// Simple non-entity storage utilities
export const storage = {
	get<T>(key: string, defaultValue: T): T {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch {
			return defaultValue;
		}
	},

	set<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error('Error saving to localStorage:', error);
		}
	},

	remove(key: string): void {
		localStorage.removeItem(key);
	},

	clear(): void {
		localStorage.clear();
	}
};
