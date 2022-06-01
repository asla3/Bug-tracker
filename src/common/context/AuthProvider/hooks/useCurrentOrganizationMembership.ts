import { useRouter } from 'next/router';

import type { AuthUser } from '@/api/types';
import useOrganization from '@/common/hooks/useOrganization';

import shouldUseErrorBoundary from '../utils/shouldUseErrorBoundary';

const useCurrentOrganizationMembership = (user: AuthUser | null) => {
	const { query, isReady } = useRouter();
	/* 
		Because the only way to get the current dynamic route is to access query, we have to make sure that `query.organizationId` is a string and not an array. We could be doing more to make sure that the value we're accesing is a dynamic route and not a query param (/?organizationid=1) but I' don't think it's necessary to go that far.
	 */
	const organizationId =
		isReady && typeof query.organizationId === 'string'
			? query.organizationId
			: null;

	const organizationIdIsValid = organizationId !== null;

	const {
		isLoading,
		isIdle,
		data: currentOrganizationMembership = null,
		...queryValues
	} = useOrganization(organizationIdIsValid ? organizationId : '', {
		enabled: organizationIdIsValid && Boolean(user),
		select: (organization) => {
			if (!user) {
				throw new Error(
					`Can't select the current organization membership because the query was executed with an invalid user: \`${user}\``
				);
			}
			const currentOrganizationMembership = organization.memberships.find(
				(organizationMembership) => organizationMembership.user?.id === user.id
			);
			if (!currentOrganizationMembership) {
				throw new Error(
					`Couldn't find an organization membership for user \`${user.id} in organization \`${organizationId}\` `
				);
			}
			return currentOrganizationMembership;
		},
		useErrorBoundary: shouldUseErrorBoundary,
	});

	const role = currentOrganizationMembership?.role || null;

	return {
		currentOrganizationMembership,
		role,
		isLoading: isLoading || isIdle,
		...queryValues,
	};
};

export default useCurrentOrganizationMembership;
