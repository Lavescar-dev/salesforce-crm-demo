import { browser } from '$app/environment';
import type { KnowledgeArticle } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class KnowledgeArticlesStore {
	private storage: StorageManager<KnowledgeArticle>;
	items = $state<KnowledgeArticle[]>([]);

	constructor() {
		this.storage = new StorageManager<KnowledgeArticle>(STORAGE_KEYS.KNOWLEDGE_ARTICLES);
		if (browser) {
			this.load();
		}
	}

	load() {
		this.items = this.storage.getAll();
	}

	getById(id: string): KnowledgeArticle | null {
		return this.storage.getById(id);
	}

	create(data: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeArticle {
		const newArticle = this.storage.create(data);
		this.load();
		return newArticle;
	}

	update(id: string, data: Partial<KnowledgeArticle>): KnowledgeArticle | null {
		const updatedArticle = this.storage.update(id, data);
		if (updatedArticle) {
			this.load();
		}
		return updatedArticle;
	}

	delete(id: string): boolean {
		const success = this.storage.delete(id);
		if (success) {
			this.load();
		}
		return success;
	}
}

export const knowledgeArticlesStore = new KnowledgeArticlesStore();
