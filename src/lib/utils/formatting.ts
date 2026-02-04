import { format, formatDistance, parseISO } from 'date-fns';

export const formatters = {
	currency: (value: number, currency = 'USD'): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(value);
	},

	number: (value: number): string => {
		return new Intl.NumberFormat('en-US').format(value);
	},

	percent: (value: number): string => {
		return `${Math.round(value)}%`;
	},

	date: (value: string | Date, formatStr = 'MMM d, yyyy'): string => {
		try {
			const date = typeof value === 'string' ? parseISO(value) : value;
			return format(date, formatStr);
		} catch {
			return '';
		}
	},

	dateTime: (value: string | Date): string => {
		return formatters.date(value, 'MMM d, yyyy h:mm a');
	},

	relativeTime: (value: string | Date): string => {
		try {
			const date = typeof value === 'string' ? parseISO(value) : value;
			return formatDistance(date, new Date(), { addSuffix: true });
		} catch {
			return '';
		}
	},

	phone: (value: string): string => {
		const cleaned = value.replace(/\D/g, '');
		if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
		}
		return value;
	},

	truncate: (value: string, maxLength: number): string => {
		if (value.length <= maxLength) return value;
		return value.slice(0, maxLength - 3) + '...';
	},

	capitalize: (value: string): string => {
		return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
	},

	initials: (firstName: string, lastName: string): string => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}
};
