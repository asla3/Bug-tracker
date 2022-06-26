import { useQuery, UseQueryOptions } from 'react-query';

import { getOrganizations } from '@/api';
import type { Organization } from '@/api/types';
import { organizationKeys } from '@/modules/react-query';

export interface UseOrganizationsOptions<TData = Organization[]>
	extends Omit<
		UseQueryOptions<Organization[], unknown, TData, string[]>,
		'queryKey' | 'queryFn'
	> {}

const useOrganizations = <TData = Organization[]>(
	options?: UseOrganizationsOptions<TData>
) => {
	return useQuery(organizationKeys.all, getOrganizations, options);
};

export default useOrganizations;
