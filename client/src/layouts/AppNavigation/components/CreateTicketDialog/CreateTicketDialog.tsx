import * as React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Button, { ButtonProps } from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';

import type { PendingTicket, Ticket } from '@/api/types';
import Dialog, { DialogProps } from '@/common/components/Dialog';
import { ErrorBoundary, ErrorFallback } from '@/modules/error-boundary';
import toast from '@/modules/toast';

import useCreateTicketMutation from '../../hooks/useCreateTicketMutation';
import CreateTicketForm from './CreateTicketForm';
import CreateTicketFormErrorBanner from './CreateTicketFormErrorBanner';

export interface CreateTicketDialogProps extends Pick<DialogProps, 'open'> {
	organizationId: string;
	selectedProjectId?: string;
	onClose?: () => void;
	onCreate?: (ticket: Ticket, dialogShouldStayOpen: boolean) => void;
}

type DiscardButtonProps = Omit<ButtonProps, 'color' | 'children'>;

const CREATE_TICKET_FORM_ID = 'create-ticket-form';

const DIALOG_LABEL_ID = 'create-ticket-dialog-label';

const DiscardButton = (props: DiscardButtonProps) => (
	<Button color="inherit" {...props}>
		Discard
	</Button>
);

const CreateTicketDialog = ({
	organizationId,
	selectedProjectId,
	open,
	onClose,
	onCreate,
}: CreateTicketDialogProps) => {
	const [dialogShouldStayOpen, setDialogShouldStayOpen] = React.useState(false);

	const {
		mutate: createTicket,
		isLoading: isCreatingTicket,
		error: ticketCreationError,
		reset: resetCreateTicketMutation,
	} = useCreateTicketMutation();

	const toggleKeepOpen = () => setDialogShouldStayOpen(!dialogShouldStayOpen);

	const handleDiscard = () => {
		resetCreateTicketMutation();
		setDialogShouldStayOpen(false);
		onClose?.();
	};

	const handleSubmit = (pendingTicket: PendingTicket) => {
		createTicket(pendingTicket, {
			onSuccess: (createdTicket) => {
				toast.success('Ticket created succesfully');

				resetCreateTicketMutation();

				onCreate?.(createdTicket, dialogShouldStayOpen);
			},
		});
	};

	return (
		<Dialog
			open={open}
			onClose={handleDiscard}
			preventClosing={isCreatingTicket}
			aria-labelledby={DIALOG_LABEL_ID}
		>
			<DialogTitle id={DIALOG_LABEL_ID}>Create Ticket</DialogTitle>
			<ErrorBoundary
				FallbackComponent={({ error, resetErrorBoundary }) => (
					<>
						<DialogContent>
							<ErrorFallback
								error={error}
								resetErrorBoundary={resetErrorBoundary}
							/>
						</DialogContent>
						<DialogActions>
							<DiscardButton onClick={handleDiscard} />
						</DialogActions>
					</>
				)}
			>
				<CreateTicketFormErrorBanner
					onClose={resetCreateTicketMutation} // reset mutation error on close
					error={ticketCreationError}
				/>
				<DialogContent>
					<CreateTicketForm
						id={CREATE_TICKET_FORM_ID}
						organizationId={organizationId}
						selectedProjectId={selectedProjectId}
						onSubmit={handleSubmit}
						resetOnSubmit={dialogShouldStayOpen}
					/>
				</DialogContent>
				<DialogActions>
					<FormControlLabel
						checked={dialogShouldStayOpen}
						control={<Checkbox />}
						label="Create another ticket"
						onChange={toggleKeepOpen}
						sx={{ marginRight: 'auto' }}
					/>
					<DiscardButton disabled={isCreatingTicket} onClick={handleDiscard} />
					<LoadingButton
						type="submit"
						form={CREATE_TICKET_FORM_ID}
						loading={isCreatingTicket}
					>
						Create
					</LoadingButton>
				</DialogActions>
			</ErrorBoundary>
		</Dialog>
	);
};

export default CreateTicketDialog;
