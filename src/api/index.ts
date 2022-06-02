import { z } from 'zod';

import type { AuthUser, AuthPayload, Organization } from '@/api/types';
import { graphQLClient } from '@/common/utils/graphqlRequestUtils';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutations';
import { GET_PROFILE_QUERY, GET_ORGANIZATION_QUERY } from '@/graphql/queries';
import {
	organizationSchema,
	authUserSchema,
	authPayloadSchema,
} from '@/validation';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
}

const validateOrganizationResponse = z.object({
	organization: organizationSchema,
}).parseAsync;

const validateProfileResponse = z.object({
	profile: authUserSchema,
}).parseAsync;

const validateLoginResponse = z.object({ login: authPayloadSchema }).parseAsync;

const validateRegisterResponse = z.object({
	register: authPayloadSchema,
}).parseAsync;

export const loginWithEmailAndPassword = async (
	credentials: LoginCredentials
): Promise<AuthPayload> => {
	const response = await graphQLClient.request<unknown>(
		LOGIN_MUTATION,
		credentials
	);
	const { login: authPayload } = await validateLoginResponse(response);
	return authPayload;
};

export const registerWithEmailAndPassword = async (
	credentials: RegisterCredentials
): Promise<AuthPayload> => {
	const response = await graphQLClient.request<unknown>(
		REGISTER_MUTATION,
		credentials
	);
	const { register: authPayload } = await validateRegisterResponse(response);
	return authPayload;
};

export const getProfile = async (): Promise<AuthUser> => {
	const response = await graphQLClient.request<unknown>(GET_PROFILE_QUERY);
	const { profile: authUser } = await validateProfileResponse(response);
	return authUser;
};

export const getOrganization = async (id: string): Promise<Organization> => {
	const response = await graphQLClient.request<unknown>(
		GET_ORGANIZATION_QUERY,
		{ id }
	);
	const { organization } = await validateOrganizationResponse(response);
	return organization;
};
