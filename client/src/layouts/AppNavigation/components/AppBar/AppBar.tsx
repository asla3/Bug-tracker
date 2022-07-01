import * as React from 'react';

import HamburgerIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Link from '@/common/components/Link';
import { useAuth } from '@/common/context/AuthProvider';
import { PROFILE, LOGOUT } from '@/routes';

import { DESKTOP_SIDEBAR_START } from '../../constants';

export interface AppBarProps {
	/**
	 * Mui sx prop to control the root element styling
	 */
	sx?: MuiAppBarProps['sx'];
	/**
	 * Callback executed when the user requests opening the navigation drawer by clicking on the hamburguer icon.
	 */
	openDrawer: () => void;
}

const AppBar = ({ sx, openDrawer }: AppBarProps) => {
	const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
		React.useState<null | HTMLElement>(null);

	const accountMenuIsOpen = Boolean(accountMenuAnchorEl);

	const { user } = useAuth({ assertMode: 'user' });

	const openAccountMenu = (event: React.MouseEvent<HTMLElement>) =>
		setAccountMenuAnchorEl(event.currentTarget);

	const closeAccountMenu = () => setAccountMenuAnchorEl(null);

	return (
		<MuiAppBar sx={sx}>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open navigation drawer"
					onClick={openDrawer}
					sx={{ display: { [DESKTOP_SIDEBAR_START]: 'none' } }}
				>
					<HamburgerIcon />
				</IconButton>
				<Typography component="span" variant="h6">
					Bug tracker
				</Typography>
				<Tooltip title="Not implemented yet" aria-hidden="true">
					<IconButton color="inherit" sx={{ marginLeft: 'auto' }}>
						<NotificationsIcon />
					</IconButton>
				</Tooltip>
				<IconButton
					aria-label="open account menu"
					aria-controls="account-menu"
					aria-haspopup="true"
					onClick={openAccountMenu}
					color="inherit"
				>
					<Avatar src={user.avatarUrl} />
				</IconButton>
				<Menu
					open={accountMenuIsOpen}
					anchorEl={accountMenuAnchorEl}
					id="account-menu"
					onClose={closeAccountMenu}
					aria-label="account menu"
				>
					<MenuItem
						divider
						dense
						onClick={closeAccountMenu}
						component={Link}
						noLinkStyle
						href={PROFILE}
					>
						<span>
							Signed in as <b>{user.name}</b>
						</span>
					</MenuItem>
					<MenuItem
						onClick={closeAccountMenu}
						component={Link}
						noLinkStyle
						href={PROFILE}
					>
						Account settings
					</MenuItem>
					<MenuItem
						onClick={closeAccountMenu}
						component={Link}
						noLinkStyle
						href={LOGOUT}
					>
						Log out
					</MenuItem>
				</Menu>
			</Toolbar>
		</MuiAppBar>
	);
};

export default AppBar;
