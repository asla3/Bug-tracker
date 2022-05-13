/**
 * Name of the `key` where the auth token is stored in local storage.
 */
export const authTokenKeyName = 'authToken';

export const getAuthToken = () => localStorage.getItem(authTokenKeyName);

export const storeAuthToken = (token: string) =>
	localStorage.setItem(authTokenKeyName, token);

export const removeStoredAuthToken = () =>
	localStorage.removeItem(authTokenKeyName);
