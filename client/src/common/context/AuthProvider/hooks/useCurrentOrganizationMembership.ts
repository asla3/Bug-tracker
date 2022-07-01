import type { AuthUser } from '@/api/types';
import useOrganization from '@/common/hooks/useOrganization';
import useViewInfo from '@/common/hooks/useViewInfo';

import shouldUseErrorBoundary from '../utils/shouldUseErrorBoundary';

const useCurrentOrganizationMembership = (user: AuthUser | null) => {
	const [{ organizationId }, isReady] = useViewInfo();

	const organizationIdIsValid = organizationId !== null;

	const queryIsEnabled = isReady && organizationIdIsValid && Boolean(user);

	const {
		isLoading,
		isIdle,
		data: currentOrganizationMembership = null,
		...queryValues
	} = useOrganization(organizationIdIsValid ? organizationId : '', {
		enabled: queryIsEnabled,
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
		isLoading: isLoading || !isReady || (queryIsEnabled && isIdle), // I think this last case should be impossible but adding it just to be sure.
		...queryValues,
	};
};

export default useCurrentOrganizationMembership;
