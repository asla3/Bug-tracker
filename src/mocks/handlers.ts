import { graphql } from 'msw';

const users = [
	{ id: '1', name: 'Andrés Loreto', avatarUrl: '/favicon.ico' },
	{ id: '2', name: 'Demo user', avatarUrl: '/favicon.ico' },
];

const organizations = [
	{
		id: '1',
		name: 'Vercel',
		imageUrl: '/favicon.ico',
		members: [{ user: users[0], role: 'admin' }],
	},
	{
		id: '2',
		name: 'Google',
		imageUrl: '/favicon.ico',
		members: [{ user: users[0], role: 'admin' }],
	},
];

const projects = [
	{
		id: '1',
		name: 'Bug tracker',
		description:
			'A bug tracker that allows organizations to keep track of bugs',
		organization: organizations[1],
	},
];

// enum TICKET_TYPE_OPTIONS {
// 	BUG = 'Bug',
// 	FEATURE_REQUEST = 'Feature request',
// }

// enum TICKET_PRIORITY_OPTIONS {
// 	HIGH = 'High',
// 	MEDIUM = 'Medium',
// 	LOW = 'Low',
// }

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
			projects.find((project) => project.organization.id === organizationId) ||
			[];

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
];

export default handlers;
