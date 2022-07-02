import * as React from 'react';

import type { UseMutateAsyncFunction } from 'react-query';

import type { LoginCredentials, RegisterCredentials } from '@/api';
import type {
	AuthUser,
	MembershipRole,
	OrganizationMembership,
} from '@/api/types';

export interface AuthContextValues {
	user: AuthUser | null;
	isLoadingUser: boolean;
	userError: unknown;
	userFailureCount: number;
	login: UseMutateAsyncFunction<AuthUser, any, LoginCredentials>;
	isLoggingIn: boolean;
	logout: UseMutateAsyncFunction<any, any, void, any>;
	isLoggingOut: boolean;
	register: UseMutateAsyncFunction<AuthUser, any, RegisterCredentials>;
	isRegistering: boolean;
	currentOrganizationMembership: OrganizationMembership | null;
	currentOrganizationMembershipError: unknown;
	currentOrganizationMembershipFailureCount: number;
	isLoadingCurrentOrganizationMembership: boolean;
	role: MembershipRole | null;
	isLoading: boolean;
}

const AuthContext = React.createContext<null | AuthContextValues>(null);
AuthContext.displayName = 'AuthContext';

export default AuthContext;
