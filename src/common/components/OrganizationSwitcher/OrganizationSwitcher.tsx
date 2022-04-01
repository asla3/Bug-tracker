import * as React from 'react';

import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';

import Link from '@/common/components/Link';
import type { Organization } from '@/common/types/Data';
import { getRouteToOrganizationProjects, ORGANIZATIONS } from '@/routes/routes';

export interface OrganizationSwitcherProps
	extends Pick<MenuProps, 'open' | 'anchorEl'> {
	organizations: Organization[];
	onClose: () => void;
}

const OrganizationSwitcher = ({
	organizations,
	open,
	onClose,
	anchorEl,
}: OrganizationSwitcherProps) => {
	return (
		<Menu open={open} onClose={onClose} anchorEl={anchorEl}>
			{organizations.map(({ id, imageUrl, name }) => (
				<MenuItem
					component={Link}
					onClick={onClose}
					href={getRouteToOrganizationProjects({ organizationId: id })}
					key={id}
					noLinkStyle
				>
					<ListItemIcon>
						{/* TODO: add height and witdh properties. These are just temporal values */}
						<Image src={imageUrl} alt="" width={50} height={50} />
					</ListItemIcon>
					<ListItemText sx={{ marginLeft: 2 }}>{name}</ListItemText>
				</MenuItem>
			))}
			<Divider />
			<MenuItem
				component={Link}
				href={ORGANIZATIONS}
				onClick={onClose}
				noLinkStyle
			>
				View all organizations
			</MenuItem>
		</Menu>
	);
};

export default OrganizationSwitcher;
