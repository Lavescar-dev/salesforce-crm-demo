export * from './storage-keys';
export * from './navigation';

export const MOCK_USERS = [
	{
		id: 'user_1',
		email: 'admin@demo.com',
		password: 'admin123',
		firstName: 'Admin',
		lastName: 'User',
		role: 'admin' as const
	},
	{
		id: 'user_2',
		email: 'sales@demo.com',
		password: 'sales123',
		firstName: 'Sales',
		lastName: 'Rep',
		role: 'sales_rep' as const
	},
	{
		id: 'user_3',
		email: 'service@demo.com',
		password: 'service123',
		firstName: 'Service',
		lastName: 'Agent',
		role: 'service_agent' as const
	},
	{
		id: 'user_4',
		email: 'marketing@demo.com',
		password: 'marketing123',
		firstName: 'Marketing',
		lastName: 'User',
		role: 'marketing_user' as const
	}
];
