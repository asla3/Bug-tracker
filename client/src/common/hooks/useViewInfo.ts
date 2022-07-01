import { useRouter } from 'next/router';

export type ViewInfo = Record<
	'organizationId' | 'projectId' | 'ticketId',
	string | null
>;

const isValidParam = (param: unknown, isReady: boolean) => {
	return isReady && typeof param === 'string' ? param : null;
};

const useViewInfo = (): [ViewInfo, boolean] => {
	const { query, isReady } = useRouter();

	const viewInfo: ViewInfo = {
		organizationId: isValidParam(query.organizationId, isReady),
		projectId: isValidParam(query.projectId, isReady),
		ticketId: isValidParam(query.ticketId, isReady),
	};

	return [viewInfo, isReady];
};

export default useViewInfo;
