import { browser } from '$app/environment';
import type { Campaign } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class CampaignsStore {
	private storage: StorageManager<Campaign>;
	items = $state<Campaign[]>([]);

	constructor() {
		this.storage = new StorageManager<Campaign>(STORAGE_KEYS.CAMPAIGNS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Campaign | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
		const newCampaign = this.storage.create(data);
		this.load();
		return newCampaign;
	}

	update(id: string, data: Partial<Campaign>): Campaign | null {
		const updatedCampaign = this.storage.update(id, data);
		if (updatedCampaign) {
			this.load();
		}
		return updatedCampaign;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}
}

export const campaignsStore = new CampaignsStore();
