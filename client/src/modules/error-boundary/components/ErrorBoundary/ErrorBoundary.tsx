import { withScope, captureException } from '@sentry/nextjs';
import {
	ErrorBoundary as REB_ErrorBoundary,
	ErrorBoundaryPropsWithComponent as REB_ErrorBoundaryPropsWithComponent,
} from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

import callAll from '@/common/utils/callAll';

import ErrorFallback from '../ErrorFallback';

export interface ErrorBoundaryProps
	extends React.PropsWithChildren<
		Omit<REB_ErrorBoundaryPropsWithComponent, 'FallbackComponent'> &
			Partial<Pick<REB_ErrorBoundaryPropsWithComponent, 'FallbackComponent'>>
	> {}

const reportErrorToSentry = (
	error: Error,
	info: {
		componentStack: string;
	}
) => {
	withScope((scope) => {
		scope.setExtras(info);
		captureException(error);
	});
};

const ErrorBoundary = ({
	FallbackComponent,
	onError,
	onReset,
	...props
}: ErrorBoundaryProps) => {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<REB_ErrorBoundary
			FallbackComponent={FallbackComponent || ErrorFallback}
			onError={onError || reportErrorToSentry} // todo maybe we don't want `reportErrorToSentry` to get overriden. I'm considering letting `onError` get acess to the scope so it can append more info to it
			onReset={callAll(reset, onReset)}
			{...props}
		/>
	);
};

export default ErrorBoundary;
