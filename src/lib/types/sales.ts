import type { BaseEntity, Address } from './common';

// Lead Types
export type LeadStatus = 'New' | 'Working' | 'Nurturing' | 'Qualified' | 'Unqualified';
export type LeadSource = 'Web' | 'Phone Inquiry' | 'Partner Referral' | 'Purchased List' | 'Other';
export type LeadRating = 'Hot' | 'Warm' | 'Cold';

export interface Lead extends BaseEntity {
	firstName: string;
	lastName: string;
	company: string;
	title?: string;
	email: string;
	phone?: string;
	status: LeadStatus;
	source: LeadSource;
	rating?: LeadRating;
	annualRevenue?: number;
	numberOfEmployees?: number;
	industry?: string;
	address?: Address;
	description?: string;
	ownerId?: string;
}

// Opportunity Types
export type OpportunityStage =
	| 'Prospecting'
	| 'Qualification'
	| 'Needs Analysis'
	| 'Value Proposition'
	| 'Perception Analysis' // Decision Makers -> Perception Analysis
	| 'Proposal/Price Quote' // Proposal -> Proposal/Price Quote
	| 'Negotiation/Review' // Negotiation -> Negotiation/Review
	| 'Closed Won'
	| 'Closed Lost';

export interface Opportunity extends BaseEntity {
	name: string;
	accountId: string;
	accountName?: string;
	stage: OpportunityStage;
	amount: number;
	probability: number;
	closeDate: string;
	type?: string;
	leadSource?: LeadSource;
	nextStep?: string;
	description?: string;
	ownerId?: string;
}

// Account Types
export type AccountType = 'Prospect' | 'Customer' | 'Partner' | 'Other';
export type Industry =
	| 'Technology'
	| 'Finance'
	| 'Healthcare'
	| 'Manufacturing'
	| 'Retail'
	| 'Education'
	| 'Other';

export interface Account extends BaseEntity {
	name: string;
	type: AccountType;
	industry?: Industry;
	annualRevenue?: number;
	numberOfEmployees?: number;
	website?: string;
	phone?: string;
	billingAddress?: Address;
	shippingAddress?: Address;
	description?: string;
	ownerId?: string;
}

// Contact Types
export interface Contact extends BaseEntity {
	firstName: string;
	lastName: string;
	accountId: string;
	accountName?: string;
	email: string;
	phone?: string;
	mobile?: string;
	title?: string;
	department?: string;
	mailingAddress?: Address;
	description?: string;
	ownerId?: string;
}

// Activity Types
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note';
export type ActivityStatus = 'Planned' | 'Completed' | 'Cancelled';
export type RelatedToType = 'Lead' | 'Opportunity' | 'Account' | 'Contact' | 'Case';

export interface Activity extends BaseEntity {
	type: ActivityType;
	subject: string;
	description?: string;
	status: ActivityStatus;
	dueDate?: string;
	relatedToType: RelatedToType;
	relatedToId: string;
	ownerId?: string;
}
