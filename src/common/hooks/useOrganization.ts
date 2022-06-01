import { useQuery, UseQueryOptions } from 'react-query';

import { getOrganization } from '@/api';
import type { Organization } from '@/api/types';
import { queryKeysFactory } from '@/modules/react-query';

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
		queryKeysFactory.organization(id),
		() => getOrganization(id),
		options
	);
};

export default useOrganization;
