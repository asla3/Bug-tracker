export const authUserKeys = {
	currentUser: ['auth-user'],
};

export const organizationKeys = {
	all: ['organizations'],
	single: (id: string) => [...organizationKeys.all, id],
};

export const projectKeys = {
	all: ['projects'],
	single: (projectId: string) => [...projectKeys.all, projectId],
};
