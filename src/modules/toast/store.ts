import { nanoid } from 'nanoid';
import create from 'zustand';

export interface DismissToastFilterer {
	(toast: ToastConfig): boolean;
}

export interface ToastConfig {
	id: string;
	type: 'error' | 'success' | 'info' | 'warning';
	message: string;
	/**
	 * Object where you can append additional data to toasts, which can be used later on for dismissing them.
	 */
	meta?: Record<string, unknown>;
}

export interface ToastStore {
	toasts: ToastConfig[];
	addToast: (toast: Omit<ToastConfig, 'id'> & { id?: string }) => void;
	dismissToast: (idOrFilterer: string | DismissToastFilterer) => void;
	removeAllToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	addToast: ({ id = nanoid(), ...notificationDataWithoutId }) => {
		set((state) => ({
			toasts: [...state.toasts, { id, ...notificationDataWithoutId }],
		}));
	},
	dismissToast: (idOrFilterer) => {
		set((state) => ({
			toasts: state.toasts.filter(
				typeof idOrFilterer === 'function'
					? idOrFilterer
					: (notification) => notification.id !== idOrFilterer
			),
		}));
	},
	removeAllToasts: () => {
		set(() => ({
			toasts: [],
		}));
	},
}));
