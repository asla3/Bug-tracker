import * as React from 'react';

import type { AuthUser } from '@/api/types';

import AuthContext, { AuthContextValues } from '../AuthContext';

export interface UseAuthConfig<T extends boolean> {
	/**
	 * If `true`, will throw an error if `user` is null.
	 */
	assertUser?: T;
}

interface AuthContextValuesWithAssertedUser
	extends Omit<AuthContextValues, 'user'> {
	user: AuthUser;
}

const useAuthContext = () => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('`useAuth` must be used inside an `AuthProvider`.');
	}
	return context;
};

function useAuth<T extends false>(
	options?: UseAuthConfig<T>
): AuthContextValues;
function useAuth<T extends true>(
	options: UseAuthConfig<T>
): AuthContextValuesWithAssertedUser; //todo Typescript is not enforcing that this function returns this value, might have to find a different way to type this.
function useAuth<T extends boolean>(options?: UseAuthConfig<T>) {
	const auth = useAuthContext();
	const { user } = auth;

	if (options?.assertUser && !user) {
		throw new Error(`\`${user}\` is not a valid user.`);
	}

	return auth;
}

export default useAuth;
