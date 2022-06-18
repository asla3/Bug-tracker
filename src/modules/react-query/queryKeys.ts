export const queryKeysFactory = {
	authUser: ['auth-user'],
	organization: (id: string) => ['organization', id],
	projects: (organizationId: string) => ['projects', organizationId],
};
