import { graphql } from 'msw';

import { ORGANIZATION_MEMBER_ROLE_OPTIONS } from '@/constants';
import type { User, Organization, Project } from '@/types/api';

const users: User[] = [
	{ id: '1', name: 'Andrés Loreto', avatarUrl: '/favicon.ico' },
	{ id: '2', name: 'Demo user', avatarUrl: '/favicon.ico' },
];

const organizations: Organization[] = [
	{
		id: '1',
		name: 'Vercel',
		imageUrl: '/favicon.ico',
		members: [
			{ user: users[0], role: ORGANIZATION_MEMBER_ROLE_OPTIONS['ADMIN'] },
		],
	},
	{
		id: '2',
		name: 'Google',
		imageUrl: '/favicon.ico',
		members: [
			{ user: users[0], role: ORGANIZATION_MEMBER_ROLE_OPTIONS['ADMIN'] },
		],
	},
];

const projects: Project[] = [
	{
		id: '1',
		name: 'Bug tracker',
		description:
			'A bug tracker that allows organizations to keep track of bugs',
		organization: organizations[1],
	},
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
	graphql.query('Projects', (req, res, ctx) => {
		// const bearerToken = req.headers.get('Authorization');
		// if (!bearerToken) return res(ctx.errors([{ messaged: 'Unauthorized' }]));

		const { organizationId } = req.variables;

		const organizationProjects =
			projects.filter(
				(project) => project.organization.id === organizationId
			) || [];

		return res(
			ctx.data({
				projects: organizationProjects,
			})
		);
	}),
	graphql.query('Organization', (req, res, ctx) => {
		const { id } = req.variables;

		const organization = organizations.find(
			(organization) => organization.id === id
		);

		if (!organization) {
			return res(ctx.errors([{ message: `Couldn't find organization ${id}` }]));
		}

		return res(ctx.data({ organization }));
	}),
	graphql.mutation('Login', (req, res, ctx) => {
		return res(ctx.data({ login: { token: 'random token', user: users[0] } }));
	}),
	graphql.mutation('Register', (req, res, ctx) => {
		return res(
			ctx.data({ register: { token: 'some random token', user: users[0] } })
		);
	}),
	graphql.query('User', (req, res, ctx) => {
		return res(ctx.data({ user: users[0] }));
	}),
];

export default handlers;
