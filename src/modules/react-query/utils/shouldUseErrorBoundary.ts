import type { Query, QueryKey } from 'react-query';

import { QUERY_MAX_RETRIES } from '../constants';

const shouldUseErrorBoundary = <
	TQueryFnData = unknown,
	TError = unknown,
	TQueryData = unknown,
	TQueryKey extends QueryKey = QueryKey
>(
	error: TError,
	query: Query<TQueryFnData, TError, TQueryData, TQueryKey>
) => query.state.fetchFailureCount >= QUERY_MAX_RETRIES;

export default shouldUseErrorBoundary;
