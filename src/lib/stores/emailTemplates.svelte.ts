import { browser } from '$app/environment';
import type { EmailTemplate } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class EmailTemplatesStore {
	private storage: StorageManager<EmailTemplate>;
	items = $state<EmailTemplate[]>([]);

	constructor() {
		this.storage = new StorageManager<EmailTemplate>(STORAGE_KEYS.EMAIL_TEMPLATES);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): EmailTemplate | null {
		return this.storage.getById(id);
	}

	create(data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate {
		const newTemplate = this.storage.create(data);
		this.load();
		return newTemplate;
	}

	update(id: string, data: Partial<EmailTemplate>): EmailTemplate | null {
		const updatedTemplate = this.storage.update(id, data);
		if (updatedTemplate) {
			this.load();
		}
		return updatedTemplate;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}
}

export const emailTemplatesStore = new EmailTemplatesStore();
