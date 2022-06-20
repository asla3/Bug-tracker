import { useToastStore, ToastStore, ToastConfig } from './store';

/*
	Helpers for adding and removing toasts.
*/

export const add = (...args: Parameters<ToastStore['addToast']>) =>
	useToastStore.getState().addToast(...args);

export const dismiss = (...args: Parameters<ToastStore['dismissToast']>) =>
	useToastStore.getState().dismissToast(...args);

export const removeAll = () => useToastStore.getState().removeAllToasts();

export const success = (message: string, options?: Omit<ToastConfig, 'type'>) =>
	add({ type: 'success', message, ...options });

export const error = (message: string, options?: Omit<ToastConfig, 'type'>) =>
	add({ type: 'error', message, ...options });

export const info = (message: string, options?: Omit<ToastConfig, 'type'>) =>
	add({ type: 'info', message, ...options });

export const warning = (message: string, options?: Omit<ToastConfig, 'type'>) =>
	add({ type: 'warning', message, ...options });
