import { browser } from '$app/environment';
import type { Activity } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class ActivitiesStore {
	private storage: StorageManager<Activity>;
	items = $state<Activity[]>([]);

	constructor() {
		this.storage = new StorageManager<Activity>(STORAGE_KEYS.ACTIVITIES);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Activity | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Activity {
		const activity = this.storage.create(data);
		this.load();
		return activity;
	}

	update(id: string, data: Partial<Activity>): Activity | null {
		const activity = this.storage.update(id, data);
		if (activity) {
			this.load();
		}
		return activity;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	getByRelatedTo(relatedToId: string): Activity[] {
		return this.items.filter((activity) => activity.relatedToId === relatedToId);
	}

	filterByType(type: Activity['type']): Activity[] {
		return this.items.filter((activity) => activity.type === type);
	}

	filterByStatus(status: Activity['status']): Activity[] {
		return this.items.filter((activity) => activity.status === status);
	}
}

export const activitiesStore = new ActivitiesStore();
