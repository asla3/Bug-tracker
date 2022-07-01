import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';

export interface CreateTicketFormErrorBannerProps {
	onClose?: () => void;
	error: unknown;
}

const CreateTicketFormErrorBanner = ({
	onClose,
	error,
}: CreateTicketFormErrorBannerProps) => {
	return (
		<div aria-live="assertive">
			<Collapse in={Boolean(error)}>
				<Alert severity="error" onClose={onClose}>
					<AlertTitle>Oh no!</AlertTitle>A problem ocurred that prevented the
					ticket from being created. Please try again later.
					{/* todo show a more specific error if `error` contains an user error */}
				</Alert>
			</Collapse>
		</div>
	);
};

export default CreateTicketFormErrorBanner;
