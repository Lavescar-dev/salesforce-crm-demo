import type { BaseEntity } from './common';

// Dashboard Types
export type WidgetType = 'bar' | 'pie' | 'line' | 'funnel' | 'metric';
export type DataSource =
	| 'leads'
	| 'opportunities'
	| 'accounts'
	| 'contacts'
	| 'cases'
	| 'campaigns';

export interface DashboardWidget {
	id: string;
	type: WidgetType;
	title: string;
	dataSource: DataSource;
	config: WidgetConfig;
	position: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
}

export interface WidgetConfig {
	groupBy?: string;
	aggregateField?: string;
	aggregateFunction?: 'count' | 'sum' | 'avg';
	filters?: Record<string, any>;
	dateRange?: {
		start: string;
		end: string;
	};
}

export interface Dashboard extends BaseEntity {
	name: string;
	description?: string;
	widgets: DashboardWidget[];
	isPublic: boolean;
	ownerId?: string;
}

// Report Types
export type ReportType = 'tabular' | 'summary' | 'matrix';

export interface Report extends BaseEntity {
	name: string;
	description?: string;
	type: ReportType;
	dataSource: DataSource;
	fields: string[];
	filters?: Record<string, any>;
	groupBy?: string[];
	sortBy?: {
		field: string;
		direction: 'asc' | 'desc';
	};
	dateRange?: {
		start: string;
		end: string;
	};
	ownerId?: string;
}

// Chart Data Types
export interface ChartData {
	labels: string[];
	datasets: ChartDataset[];
}

export interface ChartDataset {
	label: string;
	data: number[];
	backgroundColor?: string | string[];
	borderColor?: string | string[];
	borderWidth?: number;
}

export interface MetricData {
	label: string;
	value: number | string;
	change?: number;
	changeType?: 'increase' | 'decrease';
	trend?: number[];
}
