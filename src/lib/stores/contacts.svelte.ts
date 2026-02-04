import { browser } from '$app/environment';
import type { Contact } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class ContactsStore {
	private storage: StorageManager<Contact>;
	items = $state<Contact[]>([]);

	constructor() {
		this.storage = new StorageManager<Contact>(STORAGE_KEYS.CONTACTS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Contact | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
		const contact = this.storage.create(data);
		this.load();
		return contact;
	}

	update(id: string, data: Partial<Contact>): Contact | null {
		const contact = this.storage.update(id, data);
		if (contact) {
			this.load();
		}
		return contact;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	getByAccountId(accountId: string): Contact[] {
		return this.items.filter((contact) => contact.accountId === accountId);
	}

	search(searchTerm: string): Contact[] {
		const term = searchTerm.toLowerCase();
		return this.items.filter(
			(contact) =>
				contact.firstName.toLowerCase().includes(term) ||
				contact.lastName.toLowerCase().includes(term) ||
				contact.email.toLowerCase().includes(term)
		);
	}
}

export const contactsStore = new ContactsStore();
