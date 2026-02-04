import type { BaseEntity } from './common';

// Campaign Types
export type CampaignType = 'Email' | 'Webinar' | 'Conference' | 'Trade Show' | 'Direct Mail' | 'Other';
export type CampaignStatus = 'Planned' | 'In Progress' | 'Completed' | 'Aborted';

export interface Campaign extends BaseEntity {
	name: string;
	type: CampaignType;
	status: CampaignStatus;
	startDate?: string;
	endDate?: string;
	budgetedCost?: number;
	actualCost?: number;
	expectedRevenue?: number;
	actualRevenue?: number;
	description?: string;
	ownerId?: string;
}

// Campaign Member Types
export type CampaignMemberStatus = 'Sent' | 'Responded' | 'Attended' | 'No Show';
export type CampaignMemberType = 'Lead' | 'Contact';

export interface CampaignMember extends BaseEntity {
	campaignId: string;
	memberType: CampaignMemberType;
	memberId: string; // Lead ID or Contact ID
	status: CampaignMemberStatus;
	hasResponded: boolean;
}

// Email Template Types
export type EmailTemplateCategory = 'Sales' | 'Service' | 'Marketing' | 'Other';

export interface EmailTemplate extends BaseEntity {
	name: string;
	subject: string;
	htmlBody: string;
	category: EmailTemplateCategory;
	isActive: boolean;
	description?: string;
}
