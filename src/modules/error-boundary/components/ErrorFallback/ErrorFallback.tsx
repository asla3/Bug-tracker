import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { FallbackProps } from 'react-error-boundary';

const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
	// todo show error if it's a http 4xx error
	// const errorCausedByUser = todo
	return (
		<div role="alert">
			<Typography>Oops, something went wrong!</Typography>
			{/* {errorCausedByUser ? (
				<>
					<Typography>Oops, something went wrong:</Typography>
					<Typography>{error.message}</Typography>
				</>
			) : (
				<>
					<Typography>An error has occured</Typography>
					<Typography>
						Sorry, an error has occurred that caused the application to crash.
					</Typography>
				</>
			)} */}
			<Button onClick={resetErrorBoundary} variant="contained">
				Try again
			</Button>
		</div>
	);
};

export default ErrorFallback;
export { FallbackProps as ErrorFallbackProps };
