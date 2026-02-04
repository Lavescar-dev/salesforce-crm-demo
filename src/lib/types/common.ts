export interface BaseEntity {
	id: string;
	createdAt: string;
	updatedAt: string;
	createdById?: string;
	updatedById?: string;
}

export interface Address {
	street?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	avatar?: string;
}

export type UserRole = 'admin' | 'sales_rep' | 'service_agent' | 'marketing_user';

export interface SelectOption {
	value: string;
	label: string;
}

export interface PaginationParams {
	page: number;
	pageSize: number;
}

export interface SortParams {
	field: string;
	direction: 'asc' | 'desc';
}

export interface FilterParams {
	[key: string]: any;
}

export interface DataTableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	render?: (value: any, row: any) => string;
}

export interface ToastMessage {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}
