const AUTH_TOKEN_KEY_NAME = 'authToken';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY_NAME);

export const storeAuthToken = (token: string) =>
	localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);

export const removeStoredAuthToken = () =>
	localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
