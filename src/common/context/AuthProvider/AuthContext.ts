import * as React from 'react';

import type { UseMutateAsyncFunction } from 'react-query';

import type { LoginCredentials, RegisterCredentials } from '@/api';
import type { AuthUser, MembershipRole } from '@/api/types';

export interface AuthContextValues {
	user: AuthUser | null;
	role: MembershipRole | null;
	login: UseMutateAsyncFunction<AuthUser, any, LoginCredentials>;
	logout: UseMutateAsyncFunction<any, any, void, any>;
	register: UseMutateAsyncFunction<AuthUser, any, RegisterCredentials>;
	isLoggingIn: boolean;
	isLoggingOut: boolean;
	isRegistering: boolean;
}

const AuthContext = React.createContext<null | AuthContextValues>(null);
AuthContext.displayName = 'AuthContext';

export default AuthContext;
