import * as React from 'react';

import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import type { AuthUser } from '@/api/types';
import Loader from '@/common/components/Loader';

import AuthContext from './AuthContext';
import {
	loadUser,
	loginUser,
	registerUser,
	logoutUser,
} from './utils/authHandlers';

export interface AuthProviderProps {
	children?: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
	const { data: user = null, isLoading: isLoadingUser } = useQuery(
		'auth-user',
		loadUser
	);

	const { query, isReady } = useRouter();
	/* 
		Because the only way to get the current dynamic route is to access query, we have to make sure that `query.organizationId` is a string and not an array. We could be doing more to make sure that the value we're accesing is a dynamic route and not a query param (/?organizationid=1) but I don't think it's necessary to go that far.
	 */
	const organizationId =
		typeof query.organizationId === 'string' ? query.organizationId : undefined;

	const role =
		user && organizationId
			? user.memberships.find(
					(membership) => membership.organization.id === organizationId
			  )?.role
			: null;

	if (role === undefined) {
		throw new Error(
			`Couldn't find role for user \`${user?.id} in organization \`${organizationId}\` `
		);
	}

	const queryClient = useQueryClient();

	const setUser = (user: AuthUser) => {
		queryClient.setQueryData('auth-user', user);
	};

	const { mutateAsync: login, isLoading: isLoggingIn } = useMutation(
		loginUser,
		{
			onSuccess: setUser,
		}
	);

	const { mutateAsync: register, isLoading: isRegistering } = useMutation(
		registerUser,
		{ onSuccess: setUser }
	);

	const { mutateAsync: logout, isLoading: isLoggingOut } = useMutation(
		logoutUser,
		{ onSuccess: () => queryClient.clear() }
	);

	const value = React.useMemo(
		() => ({
			user,
			role,
			login,
			isLoggingIn,
			logout,
			isLoggingOut,
			register,
			isRegistering,
		}),
		[
			user,
			role,
			login,
			isLoggingIn,
			register,
			isRegistering,
			logout,
			isLoggingOut,
		]
	);

	// can't render children until both user and the query params are ready
	const isLoading = isLoadingUser || !isReady;

	if (isLoading) {
		return <Loader />; //todo add full page loader
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
