import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Menu, { MenuProps } from '@mui/material/Menu';

import ListItemLinkButton from '@/common/components/ListItemLinkButton';
import { ErrorBoundary } from '@/modules/error-boundary';
import { ORGANIZATIONS } from '@/routes';

import OrganizationsList from './OrganizationsList';

export interface OrganizationSwitcherProps
	extends Pick<MenuProps, 'open' | 'anchorEl' | 'id'> {
	onClose: () => void;
	/**
	 * If `true`, the current organization will be displayed inside the lists of organizations for the user to switch to.
	 * @default false
	 */
	showCurrentOrganization?: boolean;
}

const OrganizationSwitcher = ({
	open,
	onClose,
	anchorEl,
	id,
	showCurrentOrganization = false,
}: OrganizationSwitcherProps) => {
	return (
		<Menu id={id} open={open} onClose={onClose} anchorEl={anchorEl}>
			<Box sx={{ maxHeight: 200, overflowY: 'auto' }} component="li">
				<ErrorBoundary>
					<OrganizationsList
						onOrganizationSelect={onClose}
						showCurrentOrganization={showCurrentOrganization}
					/>
				</ErrorBoundary>
			</Box>
			<Divider component="li" />
			<ListItem disablePadding onClick={onClose}>
				<ListItemLinkButton href={ORGANIZATIONS}>
					Go to my organizations
				</ListItemLinkButton>
			</ListItem>
		</Menu>
	);
};

export default OrganizationSwitcher;
