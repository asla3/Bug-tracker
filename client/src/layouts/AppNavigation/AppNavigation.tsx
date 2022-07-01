import * as React from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Router from 'next/router';

import type { Ticket } from '@/api/types';
import useViewInfo from '@/common/hooks/useViewInfo';
import { getRouteToTicket } from '@/routes';

import AppBar from './components/AppBar';
import AppDrawer from './components/AppDrawer';
import CreateTicketDialog from './components/CreateTicketDialog';
import { DESKTOP_SIDEBAR_START } from './constants';
import CreateTicketDialogHandlersContext, {
	CreateTicketDialogHandlersContextValues,
} from './CreateTicketDialogHandlersContext';

export interface AppNavigationProps {
	children: React.ReactNode;
}

interface CreateTicketDialogState {
	selectedProjectId: string | undefined;
}

const DRAWER_SIZE = '334px';

const AppNavigation = ({ children }: AppNavigationProps) => {
	// If it's null the dialog is closed
	const [createTicketDialogState, setCreateTicketDialogState] =
		React.useState<CreateTicketDialogState | null>(null);
	const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

	const [{ organizationId }] = useViewInfo();

	if (organizationId === null) {
		throw new Error(`\`${organizationId}\` is not a valid \`organizationId\``);
	}

	const createTicketDialogHandlers: CreateTicketDialogHandlersContextValues =
		React.useMemo(
			() => ({
				openCreateTicketDialog: (selectedProjectId?: string) =>
					setCreateTicketDialogState({ selectedProjectId }),
				closeCreateTicketDialog: () => setCreateTicketDialogState(null),
			}),
			[]
		);

	const openMobileDrawer = () => setMobileDrawerOpen(true);

	const closeMobileDrawer = () => setMobileDrawerOpen(false);

	const handleTicketCreation = (
		ticket: Ticket,
		dialogShouldStayOpen: boolean
	) => {
		if (dialogShouldStayOpen) return;

		createTicketDialogHandlers.closeCreateTicketDialog();

		Router.push(
			getRouteToTicket({
				ticketId: ticket.id,
				projectId: ticket.project.id,
				organizationId,
			})
		);
	};

	return (
		<CreateTicketDialogHandlersContext.Provider
			value={createTicketDialogHandlers}
		>
			<AppBar
				openDrawer={openMobileDrawer}
				sx={{
					width: { [DESKTOP_SIDEBAR_START]: `calc(100% - ${DRAWER_SIZE})` },
					marginLeft: { [DESKTOP_SIDEBAR_START]: DRAWER_SIZE },
				}}
			/>

			<Box sx={{ display: 'flex' }}>
				<AppDrawer
					mobileDrawerOpen={mobileDrawerOpen}
					onMobileDrawerClose={closeMobileDrawer}
					currentOrganizationId="1"
					sx={{
						width: DRAWER_SIZE,
						'& .MuiDrawer-paper': {
							width: DRAWER_SIZE,
						},
					}}
				/>
				<Box
					component="main"
					sx={{
						p: 3,
					}}
				>
					{/* We add a toolbar to make sure that the content is not behind AppBar */}
					<Toolbar />
					{children}
				</Box>
			</Box>
			<CreateTicketDialog
				open={createTicketDialogState !== null}
				organizationId={organizationId}
				selectedProjectId={createTicketDialogState?.selectedProjectId}
				onCreate={handleTicketCreation}
				onClose={createTicketDialogHandlers.closeCreateTicketDialog}
			/>
		</CreateTicketDialogHandlersContext.Provider>
	);
};

export default AppNavigation;
