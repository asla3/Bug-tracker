import { useQuery, UseQueryOptions } from 'react-query';

import { getOrganization } from '@/api';
import type { Organization } from '@/api/types';
import { organizationKeys } from '@/modules/react-query';

export interface UseOrganizationOptions<TData = Organization>
	extends Omit<
		UseQueryOptions<Organization, unknown, TData, string[]>,
		'queryKey' | 'queryFn'
	> {}

const useOrganization = <TData>(
	id: string,
	options?: UseOrganizationOptions<TData>
) => {
	return useQuery(
		organizationKeys.single(id),
		() => getOrganization(id),
		options
	);
};

export default useOrganization;
