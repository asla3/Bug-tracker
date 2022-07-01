import type { ParsedUrlQuery } from 'querystring';

import { useRouter as useNextRouter, NextRouter } from 'next/router';

export interface UseRouterReturn extends Omit<NextRouter, 'query'> {
	dynamicParams: ParsedUrlQuery;
	queryParams: ParsedUrlQuery;
	/**
	 * Pathname with all the dynamic params plugged in.
	 *
	 * NOTE: Using `resolvedPathname` may lead to a mismatch between client and server if the page is rendered using server-side rendering or automatic static optimization. Avoid using `resolvedPathname` until `isReady` is true.
	 */
	resolvedPathname: string;
}

const isDynamicParam = (pathname: string, queryKey: string) =>
	pathname.includes(`[...${queryKey}]`) || pathname.includes(`[${queryKey}]`);

const getQueryParams = (pathname: string, query: NextRouter['query']) => {
	const queryKeys = Object.keys(query);

	const queryParams = queryKeys.reduce<ParsedUrlQuery>(
		(queryParamsAccumulator, queryKey) => {
			if (!isDynamicParam(pathname, queryKey)) {
				queryParamsAccumulator[queryKey] = query[queryKey];
			}

			return queryParamsAccumulator;
		},
		{}
	);

	return queryParams;
};

const getDynamicParams = (pathname: string, query: NextRouter['query']) => {
	const queryKeys = Object.keys(query);

	const dynamicParams = queryKeys.reduce<ParsedUrlQuery>(
		(dynamicParamsAccumulator, currentQueryThing) => {
			if (isDynamicParam(pathname, currentQueryThing)) {
				dynamicParamsAccumulator[currentQueryThing] = query[currentQueryThing];
			}

			return dynamicParamsAccumulator;
		},
		{}
	);

	return dynamicParams;
};

const useRouter = (): UseRouterReturn => {
	const { asPath, query, pathname, ...restOfRouter } = useNextRouter();

	const resolvedPathname = new URL(asPath, 'http://fake.com').pathname;
	const queryParams = getQueryParams(pathname, query);
	const dynamicParams = getDynamicParams(pathname, query);

	return {
		...restOfRouter,
		asPath,
		pathname,
		resolvedPathname,
		dynamicParams,
		queryParams,
	};
};

export default useRouter;
