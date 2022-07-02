import * as React from 'react';

import AuthContext from './AuthContext';
import useAuthQueriesAndMutations from './hooks/useAuthQueriesAndMutations';
import useCurrentOrganizationMembership from './hooks/useCurrentOrganizationMembership';

export interface AuthProviderProps {
	children?: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
	const {
		userQuery: {
			data: user,
			isLoading: isLoadingUser,
			error: userError,
			failureCount: userFailureCount,
		},
		loginMutation: { mutateAsync: login, isLoading: isLoggingIn },
		registerMutation: { mutateAsync: register, isLoading: isRegistering },
		logoutMutation: { mutateAsync: logout, isLoading: isLoggingOut },
	} = useAuthQueriesAndMutations();

	const {
		currentOrganizationMembership,
		error: currentOrganizationMembershipError,
		isLoading: isLoadingCurrentOrganizationMembership,
		failureCount: currentOrganizationMembershipFailureCount,
		role,
	} = useCurrentOrganizationMembership(user);

	const isLoading = isLoadingUser || isLoadingCurrentOrganizationMembership;

	const value = React.useMemo(
		() => ({
			user,
			isLoadingUser,
			userError,
			userFailureCount,
			login,
			isLoggingIn,
			logout,
			isLoggingOut,
			register,
			isRegistering,
			currentOrganizationMembership,
			currentOrganizationMembershipError,
			currentOrganizationMembershipFailureCount,
			isLoadingCurrentOrganizationMembership,
			role,
			isLoading,
		}),
		[
			user,
			isLoadingUser,
			userError,
			userFailureCount,
			login,
			isLoggingIn,
			logout,
			isLoggingOut,
			register,
			isRegistering,
			currentOrganizationMembership,
			currentOrganizationMembershipError,
			currentOrganizationMembershipFailureCount,
			isLoadingCurrentOrganizationMembership,
			role,
			isLoading,
		]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
