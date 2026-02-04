import type { BaseEntity } from './common';

// Case Types
export type CaseStatus = 'New' | 'Working' | 'Escalated' | 'On Hold' | 'Closed';
export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type CaseType = 'Question' | 'Problem' | 'Feature Request' | 'Other';
export type CaseOrigin = 'Phone' | 'Email' | 'Web' | 'Chat';

export interface Case extends BaseEntity {
	caseNumber: string;
	subject: string;
	description: string;
	status: CaseStatus;
	priority: CasePriority;
	type: CaseType;
	origin: CaseOrigin;
	contactId?: string;
	accountId?: string;
	ownerId?: string;
	closedDate?: string;
}

export interface CaseComment {
	id: string;
	caseId: string;
	body: string;
	createdAt: string;
	createdById: string;
	isInternal: boolean;
}

// Knowledge Article Types
export type ArticleStatus = 'Draft' | 'Published' | 'Archived';
export type ArticleCategory =
	| 'Getting Started'
	| 'Troubleshooting'
	| 'How To'
	| 'FAQ'
	| 'Best Practices'
	| 'Other';

export interface KnowledgeArticle extends BaseEntity {
	title: string;
	summary: string;
	content: string;
	status: ArticleStatus;
	category: ArticleCategory;
	tags: string[];
	viewCount: number;
	helpfulCount: number;
	notHelpfulCount: number;
	authorId?: string;
}

export interface ArticleRating {
	id: string;
	articleId: string;
	isHelpful: boolean;
	userId?: string;
	createdAt: string;
}

export type CaseTimelineEventType = 'Comment' | 'StatusChange' | 'Edit' | 'Note';

export interface CaseTimelineEvent extends BaseEntity {
	caseId: string;
	type: CaseTimelineEventType;
	title: string;
	description: string;
	createdById?: string;
}

