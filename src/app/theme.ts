import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	components: {
		MuiDialogActions: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(2, 3), //same padding that DialogTitle is using so they match
				}),
			},
		},
	},
});

export default theme;
