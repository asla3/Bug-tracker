import { QueryClient } from 'react-query';

import { QUERY_MAX_RETRIES } from '../constants';
import shouldUseErrorBoundary from './shouldUseErrorBoundary';

const getQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: QUERY_MAX_RETRIES,
				useErrorBoundary: shouldUseErrorBoundary,
				// todo: show error on toast
				// onError:
			},
		},
	});

export default getQueryClient;
