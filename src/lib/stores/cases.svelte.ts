import { browser } from '$app/environment';
import type { Case } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class CasesStore {
	private storage: StorageManager<Case>;
	items = $state<Case[]>([]);

	constructor() {
		this.storage = new StorageManager<Case>(STORAGE_KEYS.CASES);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Case | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Case {
		const newCase = this.storage.create(data);
		this.load();
		return newCase;
	}

	update(id: string, data: Partial<Case>): Case | null {
		const updatedCase = this.storage.update(id, data);
		if (updatedCase) {
			this.load();
		}
		return updatedCase;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	getByContactId(contactId: string): Case[] {
		// Assuming 'relatedTo' can link to a contact
		return this.items.filter((caseItem) => caseItem.contactId === contactId);
	}
}

export const casesStore = new CasesStore();
