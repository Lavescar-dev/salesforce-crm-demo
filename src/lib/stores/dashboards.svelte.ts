import { browser } from '$app/environment';
import type { Dashboard } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class DashboardsStore {
	private storage: StorageManager<Dashboard>;
	items = $state<Dashboard[]>([]);

	constructor() {
		this.storage = new StorageManager<Dashboard>(STORAGE_KEYS.DASHBOARDS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Dashboard | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Dashboard {
		const newDashboard = this.storage.create(data);
		this.load();
		return newDashboard;
	}

	update(id: string, data: Partial<Dashboard>): Dashboard | null {
		const updatedDashboard = this.storage.update(id, data);
		if (updatedDashboard) {
			this.load();
		}
		return updatedDashboard;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}
}

export const dashboardsStore = new DashboardsStore();
