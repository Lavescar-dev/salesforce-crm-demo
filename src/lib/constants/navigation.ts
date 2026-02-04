export interface NavItem {
	label: string;
	href: string;
	icon?: string;
	children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
	{
		label: 'Home',
		href: '/',
		icon: 'home'
	},
	{
		label: 'Sales',
		href: '/sales',
		icon: 'trending-up',
		children: [
			{ label: 'Leads', href: '/sales/leads' },
			{ label: 'Opportunities', href: '/sales/opportunities' },
			{ label: 'Pipeline', href: '/sales/opportunities/pipeline' },
			{ label: 'Accounts', href: '/sales/accounts' },
			{ label: 'Contacts', href: '/sales/contacts' }
		]
	},
	{
		label: 'Service',
		href: '/service',
		icon: 'headset',
		children: [
			{ label: 'Cases', href: '/service/cases' },
			{ label: 'Knowledge Base', href: '/service/knowledge' }
		]
	},
	{
		label: 'Marketing',
		href: '/marketing',
		icon: 'mail',
		children: [
			{ label: 'Campaigns', href: '/marketing/campaigns' },
			{ label: 'Email Templates', href: '/marketing/email-templates' }
		]
	},
	{
		label: 'Analytics',
		href: '/analytics',
		icon: 'bar-chart',
		children: [
			{ label: 'Dashboards', href: '/analytics/dashboards' },
			{ label: 'Reports', href: '/analytics/reports' }
		]
	}
];
