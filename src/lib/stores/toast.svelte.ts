import type { ToastMessage } from '$lib/types';

class ToastStore {
	messages = $state<ToastMessage[]>([]);

	private generateId(): string {
		return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	show(
		type: ToastMessage['type'],
		message: string,
		duration: number = 5000
	): void {
		const toast: ToastMessage = {
			id: this.generateId(),
			type,
			message,
			duration
		};

		this.messages = [...this.messages, toast];

		if (duration > 0) {
			setTimeout(() => this.dismiss(toast.id), duration);
		}
	}

	success(message: string, duration?: number): void {
		this.show('success', message, duration);
	}

	error(message: string, duration?: number): void {
		this.show('error', message, duration);
	}

	warning(message: string, duration?: number): void {
		this.show('warning', message, duration);
	}

	info(message: string, duration?: number): void {
		this.show('info', message, duration);
	}

	dismiss(id: string): void {
		this.messages = this.messages.filter((m) => m.id !== id);
	}

	clear(): void {
		this.messages = [];
	}
}

export const toastStore = new ToastStore();
