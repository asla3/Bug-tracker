import * as React from 'react';

import AuthContext from './AuthContext';
import useAuthQueriesAndMutations from './hooks/useAuthQueriesAndMutations';
import useCurrentMembership from './hooks/useCurrentMembership';

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
		currentMembership,
		error: currentMembershipError,
		isLoading: isLoadingCurrentMembership,
		failureCount: currentMembershipFailureCount,
		role,
	} = useCurrentMembership(user);

	const isLoading = isLoadingUser || isLoadingCurrentMembership;

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
			currentMembership,
			currentMembershipError,
			currentMembershipFailureCount,
			isLoadingCurrentMembership,
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
			currentMembership,
			currentMembershipError,
			currentMembershipFailureCount,
			isLoadingCurrentMembership,
			role,
			isLoading,
		]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
