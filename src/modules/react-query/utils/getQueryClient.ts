import { QueryClient, QueryCache } from 'react-query';

import toast from '@/modules/toast';

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
					//todo add more specific error message but not so specific that we give the user info that they shouldn't have to worry about. We should probably check if it's a user error or a server error. If it's a server error, show a generic message, otherwise, show the full message.
					toast.error('There was a problem fetching data');
				}
			},
		}),
	});

export default getQueryClient;
