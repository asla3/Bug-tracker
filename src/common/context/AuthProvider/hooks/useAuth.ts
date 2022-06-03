import * as React from 'react';

import AuthContext, { AuthContextValues } from '../AuthContext';

interface AuthContextValuesWithAssertedUser
	extends Omit<AuthContextValues, 'user'> {
	user: NonNullable<AuthContextValues['user']>;
}

interface AuthContextValuesWithEverythingAsserted
	extends Omit<
		AuthContextValuesWithAssertedUser,
		'currentOrganizationMembership' | 'role'
	> {
	currentOrganizationMembership: NonNullable<
		AuthContextValues['currentOrganizationMembership']
	>;
	role: NonNullable<AuthContextValues['role']>;
}

type AssertMode = 'user' | 'everything';

export interface UseAuthConfig<TAssertMode extends AssertMode | undefined> {
	/**
	 * Allows you to configure which values should be asserted to make
	 * sure they're not `null`, and in case they're, an error will be thrown.
	 * The available modes are:
	 *
	 * 1. `'user'`: `'user'` will be asserted.
	 * 2. `everything`: `'user'`, `'role'`, and `'currentOrganizationMembership'` will be asserted.
	 *
	 * If you don't want anything to be asserted, just leave it as `undefined`.
	 */
	assertMode?: TAssertMode;
}

const useAuthContext = () => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('`useAuth` must be used inside an `AuthProvider`.');
	}
	return context;
};

const getAssertModeErrorMessage = (variableName: string, value: unknown) =>
	`Found an unexpected \`${value}\` value for \`${variableName}\`.`;

function useAuth<TAssertMode extends AssertMode | undefined = undefined>(
	config?: UseAuthConfig<TAssertMode>
): TAssertMode extends 'user'
	? AuthContextValuesWithAssertedUser
	: TAssertMode extends 'everything'
	? AuthContextValuesWithEverythingAsserted
	: AuthContextValues {
	const auth = useAuthContext();
	const { currentOrganizationMembership, role, user } = auth;

	if (
		(config?.assertMode === 'user' || config?.assertMode === 'everything') &&
		user === null
	) {
		throw new Error(getAssertModeErrorMessage('user', user));
	}

	if (config?.assertMode === 'everything' && role === null) {
		throw new Error(getAssertModeErrorMessage('role', role));
	}

	if (
		config?.assertMode === 'everything' &&
		currentOrganizationMembership === null
	) {
		throw new Error(
			getAssertModeErrorMessage(
				'currentOrganizationMembership',
				currentOrganizationMembership
			)
		);
	}

	//@ts-ignore - typescript is complaining because it can't infer that we're asserting values, so it thinks that `auth` is always `AuthContextValues`
	return auth;
}

export default useAuth;
