import { graphql } from 'msw';

import type {
	User,
	Organization,
	Project,
	AuthUser,
	AuthPayload,
	BaseMembership,
	OrganizationMembership,
	AuthUserMembership,
} from '@/api/types';
import { MEMBERSHIP_ROLE, MEMBERSHIP_STATUS_OPTIONS } from '@/constants';

const users: User[] = [
	{ id: '1', name: 'Andrés Loreto', avatarUrl: '/favicon.ico' },
];

const baseMemberships: BaseMembership[] = [
	{
		role: MEMBERSHIP_ROLE['ADMIN'],
		id: '1',
		status: MEMBERSHIP_STATUS_OPTIONS['ACTIVE'],
		invitation: { email: 'asloretoaguero@gmail.com' },
	},
];

const organizationMemberships: OrganizationMembership[] = baseMemberships.map(
	(membership) => ({
		...membership,
		user: users[0],
	})
);

const organizations: Organization[] = [
	{
		id: '1',
		name: 'Vercel',
		imageUrl: '/favicon.ico',
		memberships: organizationMemberships,
	},
	{
		id: '2',
		name: 'Google',
		imageUrl: '/favicon.ico',
		memberships: organizationMemberships,
	},
];

const authUserMemberships: AuthUserMembership[] = baseMemberships.map(
	(membership) => ({ ...membership, organization: organizations[0] })
);

const authUsers = [{ ...users[0], memberships: authUserMemberships }];

const projects: Project[] = [
	{
		id: '1',
		name: 'Bug tracker',
		description:
			'A bug tracker that allows organizations to keep track of bugs',
		organization: organizations[1],
	},
];

const authPayloads: AuthPayload[] = [
	{ token: 'random token', user: authUsers[0] },
];

// const tickets = [
// 	{
// 		id: 1,
// 		name: 'Finish building',
// 		description: 'should finish building app',
// 		attachments: [],
// 		assignee: [users[0], users[1]],
// 		type: TICKET_TYPE_OPTIONS['FEATURE_REQUEST'],
// 		project: projects[0],
// 		priority: TICKET_PRIORITY_OPTIONS['HIGH'],
// 	},
// ];

const handlers = [
	graphql.query('GetProjects', (req, res, ctx) => {
		// const bearerToken = req.headers.get('Authorization');
		// if (!bearerToken) return res(ctx.errors([{ messaged: 'Unauthorized' }]));

		const { organizationId } = req.variables;

		const organizationProjects: Project[] =
			projects.filter(
				(project) => project.organization.id === organizationId
			) || [];

		return res(
			ctx.data({
				projects: organizationProjects,
			})
		);
	}),
	graphql.query('GetOrganization', (req, res, ctx) => {
		const { id } = req.variables;

		const organization: Organization | undefined = organizations.find(
			(organization) => organization.id === id
		);

		if (!organization) {
			return res(ctx.errors([{ message: `Couldn't find organization ${id}` }]));
		}

		return res(ctx.data({ organization }));
	}),
	graphql.mutation('Login', (req, res, ctx) => {
		const authPayload = authPayloads[0];
		return res(ctx.data({ login: authPayload }));
	}),
	graphql.mutation('Register', (req, res, ctx) => {
		const authPayload = authPayloads[0];
		return res(ctx.data({ register: authPayload }));
	}),
	graphql.query('GetProfile', (req, res, ctx) => {
		const profile: AuthUser = authUsers[0];
		return res(ctx.data({ profile }));
	}),
];

export default handlers;
