import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
	usePopupState,
	bindTrigger,
	bindMenu,
} from 'material-ui-popup-state/hooks';

import OrganizationSwitcher from '@/common/components/OrganizationSwitcher';
import useOrganization from '@/common/hooks/useOrganization';
import assertIsNonNullable from '@/common/utils/assertIsNonNullable';

export interface OrganizationHeaderProps {
	currentOrganizationId: string;
}

const OrganizationHeader = ({
	currentOrganizationId,
}: OrganizationHeaderProps) => {
	const organizationSwitcherPopupState = usePopupState({
		variant: 'popover',
		popupId: 'drawer-organization-switcher',
	});

	const { data: currentOrganization, isLoading: isLoadingCurrentOrganization } =
		useOrganization(currentOrganizationId);

	if (isLoadingCurrentOrganization) {
		return <CircularProgress aria-label="loading current organization data" />;
	}

	assertIsNonNullable(currentOrganization);

	return (
		<>
			<Box sx={{ py: 3, paddingLeft: 2, paddingRight: 1 }}>
				<Avatar
					sx={{ marginBottom: 3 }}
					src={currentOrganization.imageUrl}
					alt=""
				/>
				<Typography variant="h6" component="span" display="block">
					{currentOrganization.name}
				</Typography>
				<Button
					{...bindTrigger(organizationSwitcherPopupState)}
					variant="text"
					sx={{ minWidth: 0, px: 0 }}
				>
					Switch
				</Button>
			</Box>
			<OrganizationSwitcher {...bindMenu(organizationSwitcherPopupState)} />
		</>
	);
};

export default OrganizationHeader;
