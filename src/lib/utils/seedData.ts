import type {
	Lead,
	Opportunity,
	Account,
	Contact,
	Activity,
	Case,
	KnowledgeArticle,
	Campaign,
	CampaignMember,
	EmailTemplate
} from '$lib/types';
import { generateCaseNumber } from './helpers';

const FIRST_NAMES = [
	'John',
	'Jane',
	'Michael',
	'Sarah',
	'David',
	'Emily',
	'Robert',
	'Lisa',
	'James',
	'Jennifer',
	'William',
	'Mary',
	'Richard',
	'Patricia',
	'Thomas'
];
const LAST_NAMES = [
	'Smith',
	'Johnson',
	'Williams',
	'Brown',
	'Jones',
	'Garcia',
	'Miller',
	'Davis',
	'Rodriguez',
	'Martinez',
	'Anderson',
	'Taylor',
	'Thomas',
	'Moore',
	'Jackson'
];
const COMPANIES = [
	'Acme Corp',
	'TechStart Inc',
	'Global Solutions',
	'Innovation Labs',
	'Enterprise Systems',
	'Digital Dynamics',
	'Future Tech',
	'Synergy Solutions',
	'Prime Industries',
	'Quantum Corp'
];
const INDUSTRIES = [
	'Technology',
	'Finance',
	'Healthcare',
	'Manufacturing',
	'Retail',
	'Education'
] as const;
const CITIES = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Boston', 'Seattle', 'Denver'];

function randomItem<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number, daysAhead: number = 0): string {
	const now = new Date();
	const days = randomNumber(-daysAgo, daysAhead);
	now.setDate(now.getDate() + days);
	return now.toISOString();
}

function generateId(): string {
	return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateLeads(count: number): Lead[] {
	const statuses: Lead['status'][] = ['New', 'Working', 'Nurturing', 'Qualified', 'Unqualified'];
	const sources: Lead['source'][] = [
		'Web',
		'Phone Inquiry',
		'Partner Referral',
		'Purchased List',
		'Other'
	];
	const ratings: Lead['rating'][] = ['Hot', 'Warm', 'Cold'];

	return Array.from({ length: count }, () => ({
		id: generateId(),
		firstName: randomItem(FIRST_NAMES),
		lastName: randomItem(LAST_NAMES),
		company: randomItem(COMPANIES),
		title: randomItem(['CEO', 'CTO', 'VP Sales', 'Director', 'Manager']),
		email: `${randomItem(FIRST_NAMES).toLowerCase()}.${randomItem(LAST_NAMES).toLowerCase()}@example.com`,
		phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
		status: randomItem(statuses),
		source: randomItem(sources),
		rating: randomItem(ratings),
		annualRevenue: randomNumber(100000, 10000000),
		numberOfEmployees: randomNumber(10, 1000),
		industry: randomItem(INDUSTRIES),
		address: {
			street: `${randomNumber(100, 9999)} Main St`,
			city: randomItem(CITIES),
			state: 'CA',
			postalCode: `${randomNumber(10000, 99999)}`,
			country: 'USA'
		},
		description: 'Interested in our enterprise solutions.',
		createdAt: randomDate(90),
		updatedAt: randomDate(30),
		ownerId: 'user_2'
	}));
}

export function generateAccounts(count: number): Account[] {
	const types: Account['type'][] = ['Prospect', 'Customer', 'Partner', 'Other'];

	return Array.from({ length: count }, () => ({
		id: generateId(),
		name: randomItem(COMPANIES),
		type: randomItem(types),
		industry: randomItem(INDUSTRIES),
		annualRevenue: randomNumber(500000, 50000000),
		numberOfEmployees: randomNumber(50, 5000),
		website: `www.${randomItem(COMPANIES).toLowerCase().replace(/\s/g, '')}.com`,
		phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
		billingAddress: {
			street: `${randomNumber(100, 9999)} Business Blvd`,
			city: randomItem(CITIES),
			state: 'CA',
			postalCode: `${randomNumber(10000, 99999)}`,
			country: 'USA'
		},
		description: 'Key enterprise account.',
		createdAt: randomDate(180),
		updatedAt: randomDate(30),
		ownerId: 'user_2'
	}));
}

export function generateOpportunities(accounts: Account[], count: number): Opportunity[] {
	const stages: Opportunity['stage'][] = [
		'Prospecting',
		'Qualification',
		'Needs Analysis',
		'Value Proposition',
		'Perception Analysis',
		'Proposal/Price Quote',
		'Negotiation/Review',
		'Closed Won',
		'Closed Lost'
	];

	return Array.from({ length: count }, () => {
		const stage = randomItem(stages);
		const probability =
			stage === 'Closed Won'
				? 100
				: stage === 'Closed Lost'
					? 0
					: randomNumber(10, 90);

		return {
			id: generateId(),
			name: `${randomItem(['Q1', 'Q2', 'Q3', 'Q4'])} ${randomItem(['Enterprise', 'Premium', 'Standard'])} Deal`,
			accountId: randomItem(accounts).id,
			stage,
			amount: randomNumber(10000, 500000),
			probability,
			closeDate: randomDate(0, 90),
			type: randomItem(['New Business', 'Existing Business', 'Renewal']),
			nextStep: 'Schedule demo call',
			description: 'Strategic opportunity for enterprise expansion.',
			createdAt: randomDate(120),
			updatedAt: randomDate(30),
			ownerId: 'user_2'
		};
	});
}

export function generateContacts(accounts: Account[], count: number): Contact[] {
	return Array.from({ length: count }, () => ({
		id: generateId(),
		firstName: randomItem(FIRST_NAMES),
		lastName: randomItem(LAST_NAMES),
		accountId: randomItem(accounts).id,
		email: `${randomItem(FIRST_NAMES).toLowerCase()}.${randomItem(LAST_NAMES).toLowerCase()}@example.com`,
		phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
		mobile: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
		title: randomItem(['VP', 'Director', 'Manager', 'Specialist', 'Coordinator']),
		department: randomItem(['Sales', 'Marketing', 'IT', 'Operations', 'Finance']),
		description: 'Key decision maker.',
		createdAt: randomDate(150),
		updatedAt: randomDate(30),
		ownerId: 'user_2'
	}));
}

export function generateActivities(
	leads: Lead[],
	opportunities: Opportunity[],
	count: number
): Activity[] {
	const types: Activity['type'][] = ['Call', 'Email', 'Meeting', 'Task', 'Note'];
	const statuses: Activity['status'][] = ['Planned', 'Completed', 'Cancelled'];

	return Array.from({ length: count }, () => {
		const relatedToType = randomItem(['Lead', 'Opportunity'] as const);
		const relatedToId =
			relatedToType === 'Lead'
				? randomItem(leads).id
				: randomItem(opportunities).id;

		return {
			id: generateId(),
			type: randomItem(types),
			subject: randomItem([
				'Follow-up call',
				'Demo presentation',
				'Contract review',
				'Discovery meeting'
			]),
			description: 'Discussion about requirements.',
			status: randomItem(statuses),
			dueDate: randomDate(0, 30),
			relatedToType,
			relatedToId,
			createdAt: randomDate(60),
			updatedAt: randomDate(30),
			ownerId: 'user_2'
		};
	});
}

export function generateCases(contacts: Contact[], count: number): Case[] {
	const statuses: Case['status'][] = ['New', 'Working', 'Escalated', 'On Hold', 'Closed'];
	const priorities: Case['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
	const types: Case['type'][] = ['Question', 'Problem', 'Feature Request', 'Other'];
	const origins: Case['origin'][] = ['Phone', 'Email', 'Web', 'Chat'];

	return Array.from({ length: count }, () => {
		const status = randomItem(statuses);
		return {
			id: generateId(),
			caseNumber: generateCaseNumber(),
			subject: randomItem([
				'Login issues',
				'Feature not working',
				'Data sync problem',
				'Performance degradation'
			]),
			description: 'Customer is experiencing issues with the system.',
			status,
			priority: randomItem(priorities),
			type: randomItem(types),
			origin: randomItem(origins),
			contactId: randomItem(contacts).id,
			closedDate: status === 'Closed' ? randomDate(30) : undefined,
			createdAt: randomDate(90),
			updatedAt: randomDate(30),
			ownerId: 'user_3'
		};
	});
}

export function generateKnowledgeArticles(count: number): KnowledgeArticle[] {
	const categories: KnowledgeArticle['category'][] = [
		'Getting Started',
		'Troubleshooting',
		'How To',
		'FAQ',
		'Best Practices'
	];

	return Array.from({ length: count }, () => ({
		id: generateId(),
		title: randomItem([
			'How to reset your password',
			'Getting started with the platform',
			'Troubleshooting login issues',
			'Best practices for data management',
			'How to create custom reports'
		]),
		summary: 'A comprehensive guide to help you get started.',
		content: `<h2>Introduction</h2><p>This article provides detailed information...</p><h2>Step-by-step guide</h2><ol><li>First step</li><li>Second step</li><li>Third step</li></ol>`,
		status: randomItem(['Draft', 'Published', 'Archived'] as const),
		category: randomItem(categories),
		tags: [randomItem(['setup', 'configuration', 'admin', 'user', 'integration'])],
		viewCount: randomNumber(0, 500),
		helpfulCount: randomNumber(0, 100),
		notHelpfulCount: randomNumber(0, 20),
		createdAt: randomDate(180),
		updatedAt: randomDate(60),
		authorId: 'user_3'
	}));
}

export function generateCampaigns(count: number): Campaign[] {
	const types: Campaign['type'][] = [
		'Email',
		'Webinar',
		'Conference',
		'Trade Show',
		'Direct Mail'
	];
	const statuses: Campaign['status'][] = ['Planned', 'In Progress', 'Completed', 'Aborted'];

	return Array.from({ length: count }, () => {
		const budgetedCost = randomNumber(5000, 50000);
		const actualCost = randomNumber(budgetedCost * 0.8, budgetedCost * 1.2);
		const expectedRevenue = randomNumber(20000, 200000);
		const actualRevenue = randomNumber(expectedRevenue * 0.5, expectedRevenue * 1.5);

		return {
			id: generateId(),
			name: `${randomItem(['Q1', 'Q2', 'Q3', 'Q4'])} ${randomItem(['Product Launch', 'Brand Awareness', 'Lead Gen'])} Campaign`,
			type: randomItem(types),
			status: randomItem(statuses),
			startDate: randomDate(90, 0),
			endDate: randomDate(0, 90),
			budgetedCost,
			actualCost,
			expectedRevenue,
			actualRevenue,
			description: 'Strategic marketing campaign targeting enterprise customers.',
			createdAt: randomDate(120),
			updatedAt: randomDate(30),
			ownerId: 'user_4'
		};
	});
}

export function generateCampaignMembers(
	campaigns: Campaign[],
	leads: Lead[],
	contacts: Contact[],
	count: number
): CampaignMember[] {
	const statuses: CampaignMember['status'][] = ['Sent', 'Responded', 'Attended', 'No Show'];

	return Array.from({ length: count }, () => {
		const memberType = randomItem(['Lead', 'Contact'] as const);
		const memberId = memberType === 'Lead' ? randomItem(leads).id : randomItem(contacts).id;
		const status = randomItem(statuses);

		return {
			id: generateId(),
			campaignId: randomItem(campaigns).id,
			memberType,
			memberId,
			status,
			hasResponded: status === 'Responded' || status === 'Attended',
			createdAt: randomDate(90),
			updatedAt: randomDate(30)
		};
	});
}

export function generateEmailTemplates(count: number): EmailTemplate[] {
	const categories: EmailTemplate['category'][] = ['Sales', 'Service', 'Marketing', 'Other'];

	return Array.from({ length: count }, () => ({
		id: generateId(),
		name: randomItem([
			'Welcome Email',
			'Product Launch',
			'Event Invitation',
			'Follow-up',
			'Thank You'
		]),
		subject: randomItem([
			'Welcome to our platform!',
			'Exciting news from our team',
			"You're invited to our upcoming event",
			'Following up on our conversation'
		]),
		htmlBody: `<html><body><h1>Hello!</h1><p>This is a sample email template.</p><p>Best regards,<br>The Team</p></body></html>`,
		category: randomItem(categories),
		isActive: Math.random() > 0.2,
		description: 'Standard email template for customer communications.',
		createdAt: randomDate(180),
		updatedAt: randomDate(60)
	}));
}

export function initializeSeedData() {
	// Generate all seed data
	const leads = generateLeads(25);
	const accounts = generateAccounts(15);
	const opportunities = generateOpportunities(accounts, 20);
	const contacts = generateContacts(accounts, 30);
	const activities = generateActivities(leads, opportunities, 40);
	const cases = generateCases(contacts, 20);
	const knowledgeArticles = generateKnowledgeArticles(15);
	const campaigns = generateCampaigns(10);
	const campaignMembers = generateCampaignMembers(campaigns, leads, contacts, 50);
	const emailTemplates = generateEmailTemplates(8);

	return {
		leads,
		accounts,
		opportunities,
		contacts,
		activities,
		cases,
		knowledgeArticles,
		campaigns,
		campaignMembers,
		emailTemplates
	};
}
