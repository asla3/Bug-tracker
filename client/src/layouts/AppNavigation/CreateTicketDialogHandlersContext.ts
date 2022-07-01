import * as React from 'react';

export interface CreateTicketDialogHandlersContextValues {
	openCreateTicketDialog: (selectedProjectId?: string) => void;
	closeCreateTicketDialog: () => void;
}

const CreateTicketDialogHandlersContext =
	React.createContext<null | CreateTicketDialogHandlersContextValues>(null);
CreateTicketDialogHandlersContext.displayName =
	'CreateTicketDialogHandlersContext';

export default CreateTicketDialogHandlersContext;
