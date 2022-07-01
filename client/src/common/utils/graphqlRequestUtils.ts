import { GraphQLClient } from 'graphql-request';

import { getAuthToken } from './authToken';

export const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!ENDPOINT) {
	throw new Error(
		`Can't initialize \`graphQLClient\` because \`${ENDPOINT}\` is not a valid endpoint. Please make sure that a valid enviroment variable was defined for \`NEXT_PUBLIC_API_ENDPOINT\` and try again.`
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

export { gql } from 'graphql-request';
export { graphQLClient };
// const {request, rawRequest, batchRequests} = graphQLClient
// export { rawRequest, request, batchRequests };
// when trying to use request from an outside module, it just doesn't work. I get `cannot read properties of undefined (reading 'options').` However, I don't get any errors when using graphQLClient.request. I thought it had to do with this: https://github.com/swc-project/swc/issues/4064, but tried disabling reexports and it still doesn't work.  Disabling this temporarily while I figure out what's wrong whith this.
