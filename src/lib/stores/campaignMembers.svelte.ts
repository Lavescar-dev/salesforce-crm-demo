import { browser } from '$app/environment';
import type { CampaignMember } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class CampaignMembersStore {
	private storage: StorageManager<CampaignMember>;
	items = $state<CampaignMember[]>([]);

	constructor() {
		this.storage = new StorageManager<CampaignMember>(STORAGE_KEYS.CAMPAIGN_MEMBERS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): CampaignMember | null {
		return this.storage.getById(id);
	}

	create(data: Omit<CampaignMember, 'id' | 'createdAt' | 'updatedAt'>): CampaignMember {
		const newMember = this.storage.create(data);
		this.load();
		return newMember;
	}

	update(id: string, data: Partial<CampaignMember>): CampaignMember | null {
		const updatedMember = this.storage.update(id, data);
		if (updatedMember) {
			this.load();
		}
		return updatedMember;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	getByCampaignId(campaignId: string): CampaignMember[] {
		return this.items.filter((member) => member.campaignId === campaignId);
	}
}

export const campaignMembersStore = new CampaignMembersStore();
