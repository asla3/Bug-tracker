import * as React from 'react';

import CreateTicketDialogHandlersContext from '../CreateTicketDialogHandlersContext';

const useCreateTicketDialogHandlers = () => {
	const context = React.useContext(CreateTicketDialogHandlersContext);

	if (!context) {
		throw new Error(
			'To use useCreateTicketDialogHandlers you must wrap your component inside the AppNavigation layout.'
		);
	}

	return context;
};

export default useCreateTicketDialogHandlers;
