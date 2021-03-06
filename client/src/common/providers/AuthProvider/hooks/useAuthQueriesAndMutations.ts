import { useQuery, useMutation, useQueryClient } from 'react-query';

import type { AuthUser } from '@/api/types';
import { authUserKeys } from '@/modules/react-query';

import {
	loadUser,
	loginUser,
	registerUser,
	logoutUser,
} from '../utils/authHandlers';
import shouldUseErrorBoundary from '../utils/shouldUseErrorBoundary';

const useAuthQueriesAndMutations = () => {
	const { data = null, ...queryValues } = useQuery(
		authUserKeys.currentUser,
		loadUser,
		{
			useErrorBoundary: shouldUseErrorBoundary,
		}
	);

	const queryClient = useQueryClient();

	const setUser = (user: AuthUser) => {
		queryClient.setQueryData(authUserKeys.currentUser, user);
	};

	const loginMutation = useMutation(loginUser, {
		onSuccess: setUser,
	});

	const registerMutation = useMutation(registerUser, { onSuccess: setUser });

	const logoutMutation = useMutation(logoutUser, {
		onSuccess: () => queryClient.clear(),
	});

	return {
		userQuery: { data, ...queryValues },
		loginMutation,
		registerMutation,
		logoutMutation,
	};
};

export default useAuthQueriesAndMutations;
