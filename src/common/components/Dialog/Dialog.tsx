import * as React from 'react';

import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';

export interface DialogProps extends MuiDialogProps {
	/**
	 * If `true`, the `onClose` callback won't be fired when the component
	 * requests to be closed by pressing the `escape` key or clicking the backdrop.
	 */
	preventClosing?: boolean;
}

const Dialog = ({ onClose, preventClosing, ...props }: DialogProps) => {
	const handleClose: NonNullable<DialogProps['onClose']> = (event, reason) => {
		if (preventClosing) return;
		onClose?.(event, reason);
	};

	return <MuiDialog {...props} onClose={handleClose} />;
};

export default Dialog;
