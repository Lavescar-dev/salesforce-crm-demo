import { browser } from '$app/environment';
import type { Account } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class AccountsStore {
	private storage: StorageManager<Account>;
	items = $state<Account[]>([]);

	constructor() {
		this.storage = new StorageManager<Account>(STORAGE_KEYS.ACCOUNTS);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): Account | null {
		return this.storage.getById(id);
	}

	create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Account {
		const account = this.storage.create(data);
		this.load();
		return account;
	}

	update(id: string, data: Partial<Account>): Account | null {
		const account = this.storage.update(id, data);
		if (account) {
			this.load();
		}
		return account;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}

	search(searchTerm: string): Account[] {
		const term = searchTerm.toLowerCase();
		return this.items.filter(
			(account) =>
				account.name.toLowerCase().includes(term) ||
				(account.website && account.website.toLowerCase().includes(term))
		);
	}
}

export const accountsStore = new AccountsStore();
