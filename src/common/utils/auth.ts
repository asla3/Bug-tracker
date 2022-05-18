import { graphQLClient } from '@/common/utils/graphqlRequestUtils';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutations';
import { GET_PROFILE_QUERY } from '@/graphql/queries';
import type { AuthPayload, User } from '@/types/api';
import { authPayloadSchema, userSchema } from '@/validation';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
}

const AUTH_TOKEN_KEY_NAME = 'authToken';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY_NAME);

export const storeAuthToken = (token: string) =>
	localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);

export const removeStoredAuthToken = () =>
	localStorage.removeItem(AUTH_TOKEN_KEY_NAME);

const handleAuthPayload = async (authPayload: unknown) => {
	const { token, user }: AuthPayload = await authPayloadSchema.parseAsync(
		authPayload
	);
	storeAuthToken(token);
	return user;
};

export const loginWithEmailAndPassword = async (
	credentials: LoginCredentials
) => {
	const { login: unsafe_authPayload } = await graphQLClient.request<{
		login: unknown;
	}>(LOGIN_MUTATION, credentials);
	return await handleAuthPayload(unsafe_authPayload);
};

export const registerWithEmailAndPassword = async (
	credentials: RegisterCredentials
) => {
	const { register: unsafe_authPayload } = await graphQLClient.request<{
		register: unknown;
	}>(REGISTER_MUTATION, credentials);
	return await handleAuthPayload(unsafe_authPayload);
};

export const getProfile = async () => {
	const { profile: unsafe_profile } = await graphQLClient.request<{
		profile: unknown;
	}>(GET_PROFILE_QUERY);
	const profile: User = await userSchema.parseAsync(unsafe_profile);
	return profile;
};
