export const validators = {
	email: (value: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value);
	},

	phone: (value: string): boolean => {
		const phoneRegex = /^[\d\s\-\(\)\+]+$/;
		return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
	},

	required: (value: any): boolean => {
		if (typeof value === 'string') return value.trim().length > 0;
		return value !== null && value !== undefined;
	},

	minLength: (value: string, min: number): boolean => {
		return value.length >= min;
	},

	maxLength: (value: string, max: number): boolean => {
		return value.length <= max;
	},

	number: (value: any): boolean => {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},

	positiveNumber: (value: number): boolean => {
		return validators.number(value) && value > 0;
	},

	url: (value: string): boolean => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	},

	date: (value: string): boolean => {
		const date = new Date(value);
		return !isNaN(date.getTime());
	},

	futureDate: (value: string): boolean => {
		const date = new Date(value);
		return date > new Date();
	}
};

export interface ValidationResult {
	valid: boolean;
	errors: Record<string, string>;
}

export function validateForm(
	data: Record<string, any>,
	rules: Record<string, Array<{ validator: (value: any) => boolean; message: string }>>
): ValidationResult {
	const errors: Record<string, string> = {};

	for (const [field, fieldRules] of Object.entries(rules)) {
		for (const rule of fieldRules) {
			if (!rule.validator(data[field])) {
				errors[field] = rule.message;
				break;
			}
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
