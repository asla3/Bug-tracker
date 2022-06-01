import type { Query, QueryKey } from 'react-query';

import hasOwnProperty from '@/common/utils/hasOwnProperty';
import { shouldUseErrorBoundary as defaultShouldUseErrorBoundary } from '@/modules/react-query';

const shouldUseErrorBoundary = <
	TQueryFnData = unknown,
	TError = unknown,
	TQueryData = unknown,
	TQueryKey extends QueryKey = QueryKey
>(
	error: TError,
	query: Query<TQueryFnData, TError, TQueryData, TQueryKey>
) => {
	const defaultConfig = defaultShouldUseErrorBoundary(error, query);
	// We need to ignore 404 and 403 errors. Consumers of this context should handle this errors themselves.
	const errorToBeHandledByConsumer =
		hasOwnProperty(error, 'response') &&
		hasOwnProperty(error.response, 'status') &&
		(error.response.status === 404 || error.response.status === 403);
	return defaultConfig && !errorToBeHandledByConsumer;
};

export default shouldUseErrorBoundary;
