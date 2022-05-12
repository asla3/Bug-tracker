import { GraphQLClient } from 'graphql-request';

import { getAuthToken } from './authToken';

const ENDPOINT = process.env.API_ENDPOINT;

if (!ENDPOINT) {
	throw new Error(
		[
			`Can't initialize \`graphQLClient\` because \`${ENDPOINT}\` is not a valid endpoint.`,
			'\n',
			`Please make sure that a valid enviroment variable was defined for \`API_ENDPOINT\` and try again.`,
		].join('')
	);
}

const graphQLClient = new GraphQLClient(ENDPOINT, {
	// weird but `headers` typings doesn't include functions even though this is what the developers recommend for dynamically generating headers for every request
	// @ts-ignore
	headers: () => {
		const token = getAuthToken();
		const headers: Record<string, string> = token
			? { authorization: `Bearer ${token}` }
			: {};
		return headers;
	},
});

export default graphQLClient;
