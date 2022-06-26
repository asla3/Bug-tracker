import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';

import useOrganizations from '@/common/hooks/useOrganizations';
import useViewInfo from '@/common/hooks/useViewInfo';
import assertIsNonNullable from '@/common/utils/assertIsNonNullable';
import compareStrings from '@/common/utils/compareStrings';
import { getRouteToOrganizationProjects } from '@/routes';

export interface OrganizationsListProps {
	onOrganizationSelect?: (selectedOrganizationId: string) => void;
	showCurrentOrganization?: boolean;
}

const OrganizationsList = ({
	onOrganizationSelect,
	showCurrentOrganization,
}: OrganizationsListProps) => {
	const [{ organizationId }] = useViewInfo();

	const { data: organizations, isLoading: isLoadingOrganizations } =
		useOrganizations({
			select:
				!showCurrentOrganization && organizationId
					? (organizations) =>
							organizations.filter(
								(organization) => organization.id !== organizationId
							)
					: undefined,
		});

	const getOrganizationClickHandler = (organizationId: string) => () =>
		onOrganizationSelect?.(organizationId);

	if (isLoadingOrganizations) {
		return <CircularProgress aria-label="loading organizations" />;
	}

	assertIsNonNullable(organizations);

	return (
		<>
			{organizations.length === 0 ? (
				<Typography
					sx={(theme) => ({
						padding: theme.spacing(1, 2),
						color: theme.palette.text.disabled,
					})}
				>
					No organizations to switch to
				</Typography>
			) : (
				<>
					<Box component="span" sx={visuallyHidden}>
						Your organizations:
					</Box>
					<List disablePadding>
						{organizations
							.sort((organizationA, organizationB) =>
								compareStrings(organizationA.name, organizationB.name, {
									sensitivity: 'base',
								})
							)
							.map(({ id, imageUrl, name }) => (
								<ListItem
									disablePadding
									onClick={getOrganizationClickHandler(id)}
									key={id}
								>
									<ListItemButton
										href={getRouteToOrganizationProjects({
											organizationId: id,
										})}
									>
										<Avatar
											src={imageUrl}
											alt=""
											sx={{ width: 30, height: 30 }}
										/>
										<ListItemText sx={{ marginLeft: 2 }}>{name}</ListItemText>
									</ListItemButton>
								</ListItem>
							))}
					</List>
				</>
			)}
		</>
	);
};

export default OrganizationsList;
