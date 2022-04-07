import * as React from 'react';

import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';

export interface StaticInputLabelProps
	extends Omit<InputLabelProps, 'shrink'> {}

/**
 * Label for input elements built on top of MUI's `<InputLabel />` with some custom styling
 * to make it static instead of absolute positioned.
 */
const StaticInputLabel = ({ sx = [], ...props }: StaticInputLabelProps) => {
	return (
		<InputLabel
			shrink
			sx={[
				{
					transform: 'none',
					marginBottom: 1,
					position: 'static',
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
			{...props}
		/>
	);
};

export default StaticInputLabel;
