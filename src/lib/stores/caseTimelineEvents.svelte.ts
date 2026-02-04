import { browser } from '$app/environment';
import type { CaseTimelineEvent } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class CaseTimelineEventsStore {
	private storage: StorageManager<CaseTimelineEvent>;
	items = $state<CaseTimelineEvent[]>([]);

	constructor() {
		this.storage = new StorageManager<CaseTimelineEvent>(STORAGE_KEYS.CASE_TIMELINE_EVENTS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): CaseTimelineEvent | null {
		return this.storage.getById(id);
	}

	create(data: Omit<CaseTimelineEvent, 'id' | 'createdAt' | 'updatedAt'>): CaseTimelineEvent {
		const newEvent = this.storage.create(data);
		this.load();
		return newEvent;
	}

	update(id: string, data: Partial<CaseTimelineEvent>): CaseTimelineEvent | null {
		const updatedEvent = this.storage.update(id, data);
		if (updatedEvent) {
			this.load();
		}
		return updatedEvent;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	getByCaseId(caseId: string): CaseTimelineEvent[] {
		return this.items.filter((event) => event.caseId === caseId);
	}
}

export const caseTimelineEventsStore = new CaseTimelineEventsStore();
