import type { AuthUser, AuthPayload, Organization } from '@/api/types';
import { graphQLClient } from '@/common/utils/graphqlRequestUtils';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutations';
import { GET_PROFILE_QUERY, GET_ORGANIZATION_QUERY } from '@/graphql/queries';
import {
	authPayloadSchema,
	authUserSchema,
	organizationSchema,
} from '@/validation';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
}

const validateAuthPayload = (
	unsafe_authPayload: unknown
): Promise<AuthPayload> => authPayloadSchema.parseAsync(unsafe_authPayload);

export const loginWithEmailAndPassword = async (
	credentials: LoginCredentials
) => {
	const { login: unsafe_authPayload } = await graphQLClient.request<{
		login: unknown;
	}>(LOGIN_MUTATION, credentials);
	return await validateAuthPayload(unsafe_authPayload);
};

export const registerWithEmailAndPassword = async (
	credentials: RegisterCredentials
) => {
	const { register: unsafe_authPayload } = await graphQLClient.request<{
		register: unknown;
	}>(REGISTER_MUTATION, credentials);
	return await validateAuthPayload(unsafe_authPayload);
};

export const getProfile = async () => {
	const { profile: unsafe_profile } = await graphQLClient.request<{
		profile: unknown;
	}>(GET_PROFILE_QUERY);
	const profile: AuthUser = await authUserSchema.parseAsync(unsafe_profile);
	return profile;
};

export const getOrganization = async (id: string) => {
	const { organization: unsafe_organization } = await graphQLClient.request<{
		organization: unknown;
	}>(GET_ORGANIZATION_QUERY, { id });

	const organization: Organization = await organizationSchema.parseAsync(
		unsafe_organization
	);

	return organization;
};
