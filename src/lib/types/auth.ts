import type { User } from './common';

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface MockUser {
	email: string;
	password: string;
	role: 'admin' | 'sales_rep' | 'service_agent' | 'marketing_user';
	firstName: string;
	lastName: string;
}
