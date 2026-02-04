export const STORAGE_KEYS = {
	// Auth
	AUTH_USER: 'crm_auth_user',
	AUTH_TOKEN: 'crm_auth_token',

	// Sales Cloud
	LEADS: 'crm_leads',
	OPPORTUNITIES: 'crm_opportunities',
	ACCOUNTS: 'crm_accounts',
	CONTACTS: 'crm_contacts',
	ACTIVITIES: 'crm_activities',

	// Service Cloud
	CASES: 'crm_cases',
	CASE_COMMENTS: 'crm_case_comments',
	CASE_TIMELINE_EVENTS: 'crm_case_timeline_events',
	KNOWLEDGE_ARTICLES: 'crm_knowledge_articles',
	ARTICLE_RATINGS: 'crm_article_ratings',

	// Marketing
	CAMPAIGNS: 'crm_campaigns',
	CAMPAIGN_MEMBERS: 'crm_campaign_members',
	EMAIL_TEMPLATES: 'crm_email_templates',

	// Analytics
	DASHBOARDS: 'crm_dashboards',
	REPORTS: 'crm_reports',

	// App State
	DATA_VERSION: 'crm_data_version',
	RECENTLY_VIEWED: 'crm_recently_viewed',
	INIT_FLAG: 'crm_initialized'
} as const;

export const CURRENT_DATA_VERSION = '1.0.0';
