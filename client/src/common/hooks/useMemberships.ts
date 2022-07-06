import type { Organization, Membership } from '@/api/types';

import useOrganization, { UseOrganizationOptions } from './useOrganization';

const selectMemberships = (organization: Organization): Membership[] =>
	organization.memberships;

const useMemberships = (
	id: string,
	options?: Omit<UseOrganizationOptions<Membership[]>, 'select'>
) => useOrganization(id, { select: selectMemberships, ...options });

export default useMemberships;
