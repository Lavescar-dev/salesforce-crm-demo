import { browser } from '$app/environment';
import type { Lead } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class LeadsStore {
	private storage: StorageManager<Lead>;
	items = $state<Lead[]>([]);

	constructor() {
		this.storage = new StorageManager<Lead>(STORAGE_KEYS.LEADS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Lead | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
		const lead = this.storage.create(data);
		this.load();
		return lead;
	}

	update(id: string, data: Partial<Lead>): Lead | null {
		const lead = this.storage.update(id, data);
		if (lead) {
			this.load();
		}
		return lead;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	search(searchTerm: string): Lead[] {
		const term = searchTerm.toLowerCase();
		return this.items.filter(
			(lead) =>
				lead.firstName.toLowerCase().includes(term) ||
				lead.lastName.toLowerCase().includes(term) ||
				lead.company.toLowerCase().includes(term) ||
				lead.email.toLowerCase().includes(term)
		);
	}

	filterByStatus(status: Lead['status']): Lead[] {
		return this.items.filter((lead) => lead.status === status);
	}
}

export const leadsStore = new LeadsStore();
