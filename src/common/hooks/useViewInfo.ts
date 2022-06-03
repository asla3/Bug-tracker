import { useRouter } from 'next/router';

export type ViewInfo = Record<
	'organizationId' | 'projectId' | 'ticketId',
	string | null
>;

const isValidParam = (param: unknown) => {
	return typeof param === 'string' ? param : null;
};

const useViewInfo = (): [ViewInfo, boolean] => {
	const { query, isReady } = useRouter();

	const viewInfo: ViewInfo = {
		organizationId: isValidParam(query.organizationId),
		projectId: isValidParam(query.projectId),
		ticketId: isValidParam(query.ticketId),
	};

	return [viewInfo, isReady];
};

export default useViewInfo;
