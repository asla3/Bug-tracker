import { useQuery, UseQueryOptions } from 'react-query';

import { getProjects } from '@/api';
import type { Project } from '@/api/types';
import { projectKeys } from '@/modules/react-query';

export interface UseProjectsOptions<TData = Project[]>
	extends Omit<
		UseQueryOptions<Project[], unknown, TData, string[]>,
		'queryFn' | 'queryKey'
	> {}

const useProjects = <TData = Project[]>(
	organizationId: string,
	options?: UseProjectsOptions<TData>
) => {
	return useQuery(projectKeys.all, () => getProjects(organizationId), options);
};

export default useProjects;
