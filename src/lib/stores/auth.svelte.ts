import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { User, LoginCredentials } from '$lib/types';
import { STORAGE_KEYS, MOCK_USERS } from '$lib/constants';
import { storage } from '$lib/utils';

class AuthStore {
	isAuthenticated = $state(false);
	user = $state<User | null>(null);
	token = $state<string | null>(null);

	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	private loadFromStorage() {
		const savedUser = storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);
		const savedToken = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);

		if (savedUser && savedToken) {
			this.user = savedUser;
			this.token = savedToken;
			this.isAuthenticated = true;
		}
	}

	async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
		// Find matching mock user
		const mockUser = MOCK_USERS.find(
			(u) => u.email === credentials.email && u.password === credentials.password
		);

		if (!mockUser) {
			return { success: false, error: 'Invalid email or password' };
		}

		// Create user object
		const user: User = {
			id: mockUser.id,
			email: mockUser.email,
			firstName: mockUser.firstName,
			lastName: mockUser.lastName,
			role: mockUser.role
		};

		// Generate mock token
		const token = `mock_token_${Date.now()}`;

		// Update state
		this.user = user;
		this.token = token;
		this.isAuthenticated = true;

		// Save to storage
		storage.set(STORAGE_KEYS.AUTH_USER, user);
		storage.set(STORAGE_KEYS.AUTH_TOKEN, token);

		return { success: true };
	}

	logout() {
		this.user = null;
		this.token = null;
		this.isAuthenticated = false;

		storage.remove(STORAGE_KEYS.AUTH_USER);
		storage.remove(STORAGE_KEYS.AUTH_TOKEN);

		goto('/login');
	}

	hasRole(role: User['role']): boolean {
		return this.user?.role === role;
	}

	hasAnyRole(roles: User['role'][]): boolean {
		return this.user ? roles.includes(this.user.role) : false;
	}
}

export const authStore = new AuthStore();
