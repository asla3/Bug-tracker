import replaceRouteParams from './helpers/replaceRouteParams';

export const ORGANIZATIONS = '/organizations';

export const LOGIN = '/login';

export const SIGNUP = '/signup';

export const PROFILE = '/profile';

export const LOGOUT = '/logout';

export const ORGANIZATION_ID_PARAM = ':organizationId';

export const PROJECT_ID_PARAM = ':projectId';

export const TICKET_ID_PARAM = ':ticketId';

// TODO: this is too error prone, need to write tests.

export const getRouteToOrganization = (options: { organizationId: string }) => {
	return replaceRouteParams(_ORGANIZATION, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
	});
};

export const getRouteToOrganizationSettings = (options: {
	organizationId: string;
}) => {
	return replaceRouteParams(_ORGANIZATION_SETTINGS, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
	});
};

export const getRouteToOrganizationProjects = (options: {
	organizationId: string;
}) => {
	return replaceRouteParams(_ORGANIZATION_PROJECTS, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
	});
};

export const getRouteToProject = (options: {
	projectId: string;
	organizationId: string;
}) => {
	return replaceRouteParams(_PROJECT, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
		[PROJECT_ID_PARAM]: options.projectId,
	});
};

export const getRouteToProjectSettings = (options: {
	projectId: string;
	organizationId: string;
}) => {
	return replaceRouteParams(_PROJECT_SETTINGS, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
		[PROJECT_ID_PARAM]: options.projectId,
	});
};

export const getRouteToProjectTickets = (options: {
	projectId: string;
	organizationId: string;
}) => {
	return replaceRouteParams(_PROJECT_TICKETS, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
		[PROJECT_ID_PARAM]: options.projectId,
	});
};

export const getRouteToTicket = (options: {
	ticketId: string;
	projectId: string;
	organizationId: string;
}) => {
	return replaceRouteParams(_TICKET, {
		[ORGANIZATION_ID_PARAM]: options.organizationId,
		[PROJECT_ID_PARAM]: options.projectId,
		[TICKET_ID_PARAM]: options.ticketId,
	});
};

/*
	These are not safe to use unless you want to manually set the params
*/

export const _ORGANIZATION = `${ORGANIZATIONS}/${ORGANIZATION_ID_PARAM}`; //

export const _ORGANIZATION_SETTINGS = `${_ORGANIZATION}/settings`;

export const _ORGANIZATION_PROJECTS = `${_ORGANIZATION}/projects`;

export const _PROJECT = `${_ORGANIZATION_PROJECTS}/${PROJECT_ID_PARAM}`; //

export const _PROJECT_SETTINGS = `${_PROJECT}/settings`;

export const _PROJECT_TICKETS = `${_PROJECT}/tickets`;

export const _TICKET = `${_PROJECT_TICKETS}/${TICKET_ID_PARAM}`;
