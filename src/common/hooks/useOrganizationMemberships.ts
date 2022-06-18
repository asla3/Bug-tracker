import type { Organization, OrganizationMembership } from '@/api/types';

import useOrganization, { UseOrganizationOptions } from './useOrganization';

const selectOrganizationMemberships = (
	organization: Organization
): OrganizationMembership[] => organization.memberships;

const useOrganizationMemberships = (
	id: string,
	options?: Omit<UseOrganizationOptions<OrganizationMembership[]>, 'select'>
) => useOrganization(id, { select: selectOrganizationMemberships, ...options });

export default useOrganizationMemberships;
