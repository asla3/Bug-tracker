import { z } from 'zod';

import type {
	AuthUser,
	AuthPayload,
	Organization,
	Ticket,
	PendingTicket,
	Project,
} from '@/api/types';
import { graphQLClient } from '@/common/utils/graphqlRequestUtils';
import {
	LOGIN_MUTATION,
	REGISTER_MUTATION,
	CREATE_TICKET_MUTATION,
} from '@/graphql/mutations';
import {
	GET_PROFILE_QUERY,
	GET_ORGANIZATION_QUERY,
	GET_PROJECTS_QUERY,
} from '@/graphql/queries';
import {
	organizationSchema,
	authUserSchema,
	authPayloadSchema,
	ticketSchema,
	projectSchema,
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

const validateCreateTicketResponse = z.object({
	createTicket: ticketSchema,
}).parseAsync;

const validateProjectsResponse = z.object({
	projects: z.array(projectSchema),
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

export const getProjects = async (
	organizationId: string
): Promise<Project[]> => {
	const response = await graphQLClient.request<unknown>(GET_PROJECTS_QUERY, {
		organizationId,
	});

	const { projects } = await validateProjectsResponse(response);

	return projects;
};

export const createTicket = async (data: PendingTicket): Promise<Ticket> => {
	const response = await graphQLClient.request<unknown>(
		CREATE_TICKET_MUTATION,
		data
	);

	const { createTicket: createdTicket } = await validateCreateTicketResponse(
		response
	);

	return createdTicket;
};
