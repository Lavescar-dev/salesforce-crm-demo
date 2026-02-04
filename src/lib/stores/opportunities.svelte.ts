import { browser } from '$app/environment';
import type { Opportunity } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class OpportunitiesStore {
	private storage: StorageManager<Opportunity>;
	items = $state<Opportunity[]>([]);

	constructor() {
		this.storage = new StorageManager<Opportunity>(STORAGE_KEYS.OPPORTUNITIES);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Opportunity | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
		const opportunity = this.storage.create(data);
		this.load();
		return opportunity;
	}

	update(id: string, data: Partial<Opportunity>): Opportunity | null {
		const opportunity = this.storage.update(id, data);
		if (opportunity) {
			this.load();
		}
		return opportunity;
	}

	updateOpportunityStage(id: string, newStage: Opportunity['stage']): Opportunity | null {
		const opportunity = this.storage.update(id, { stage: newStage });
		if (opportunity) {
			this.load();
		}
		return opportunity;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	filterByStage(stage: Opportunity['stage']): Opportunity[] {
		return this.items.filter((opp) => opp.stage === stage);
	}

	getByAccountId(accountId: string): Opportunity[] {
		return this.items.filter((opp) => opp.accountId === accountId);
	}
}

export const opportunitiesStore = new OpportunitiesStore();
