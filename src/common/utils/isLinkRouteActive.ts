import type { LinkProps } from 'next/link';

import parsePath from './parsePath';

/**
 * Determines if the route used in a Nextjs `<Link />` is active.
 */
const isLinkRouteActive = (
	linkRoute: NonNullable<LinkProps['as' | 'href']>,
	currentRoute: string
) => {
	const linkRoutePathname =
		typeof linkRoute === 'string'
			? parsePath(linkRoute).pathname
			: linkRoute.pathname;
	if (!linkRoutePathname) {
		console.warn(
			`Couldn't determine if route is active because \`${linkRoute}\` is not a valid \`pathname\``
		);
		return false;
	}
	const currentRoutePathname = parsePath(currentRoute).pathname;

	// todo: add a `partiallyActive` boolean param to allow changing the type of comparison that is being done to determine if the linkRoute is active.
	return (
		currentRoutePathname.substring(0, linkRoutePathname.length) ===
		linkRoutePathname
	);
};

export default isLinkRouteActive;
