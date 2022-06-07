import { QueryClient, QueryCache } from 'react-query';

import { QUERY_MAX_RETRIES } from '../constants';
import shouldUseErrorBoundary from './shouldUseErrorBoundary';

const getQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: QUERY_MAX_RETRIES,
				useErrorBoundary: shouldUseErrorBoundary,
			},
		},
		queryCache: new QueryCache({
			onError: (error, query) => {
				// only show error toasts if we already have data in the cache
				// which indicates a failed background update
				if (query.state.data !== undefined) {
					// todo call toast
				}
			},
		}),
	});

export default getQueryClient;
