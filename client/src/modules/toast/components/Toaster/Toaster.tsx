import * as React from 'react';

import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { useToastStore, ToastConfig } from '../../store';

const Toaster = () => {
	const [open, setOpen] = React.useState(false);
	const [activeToast, setActiveToast] = React.useState<ToastConfig | null>(
		null
	);

	const { toasts, dismissToast } = useToastStore();

	React.useEffect(() => {
		if (toasts.length && !activeToast) {
			// set a new active toast if we are not showing any and there are toasts in the queue to be shown.
			const newActiveToast = toasts[0];

			setActiveToast({ ...newActiveToast });

			dismissToast(newActiveToast.id);

			setOpen(true);
		} else if (toasts.length && activeToast && open) {
			// If a toast is added to the queue and we're already showing one, close the old one
			setOpen(false);
		}
	}, [toasts, activeToast, open, dismissToast]);

	const handleClose = (
		event: Event | React.SyntheticEvent<any, Event>,
		reason?: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') return;

		setOpen(false);
	};

	const handleExited = () => setActiveToast(null);

	return (
		<Snackbar
			open={open}
			key={activeToast?.id}
			autoHideDuration={6000}
			onClose={handleClose}
			TransitionProps={{ onExited: handleExited }}
		>
			<Alert
				onClose={handleClose}
				severity={activeToast?.type}
				sx={{ width: '100%' }}
			>
				{activeToast?.message}
			</Alert>
		</Snackbar>
	);
};

export default Toaster;
