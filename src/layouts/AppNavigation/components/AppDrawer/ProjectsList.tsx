import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import Link from '@/common/components/Link';
import ListItemLinkButton from '@/common/components/ListItemLinkButton';
import useProjects from '@/common/hooks/useProjects';
import assertIsNonNullable from '@/common/utils/assertIsNonNullable';
import { getRouteToProject, getRouteToProjectSettings } from '@/routes';

import useCreateTicketDialogHandlers from '../../hooks/useCreateTicketDialogHandlers';

export interface ProjectsListProps {
	currentOrganizationId: string;
	mobileDrawerEnabled: boolean;
}

const PROJECT_ACTIONS_HEIGHT = 40;

const ProjectsList = ({
	currentOrganizationId,
	mobileDrawerEnabled,
}: ProjectsListProps) => {
	const [hoveredProjectId, setHoveredProjectId] = React.useState<null | string>(
		null
	);

	const { data: projects, isLoading: isLoadingProjects } = useProjects(
		currentOrganizationId
	);

	const { openCreateTicketDialog } = useCreateTicketDialogHandlers();

	const getHoveredProjectUpdater = (projectId: string | null) => () =>
		setHoveredProjectId(projectId);

	const getCreateTicketForProjectHandler = (projectId: string) => () =>
		openCreateTicketDialog(projectId);

	if (isLoadingProjects) {
		return <CircularProgress aria-label="loading projects" />;
	}

	assertIsNonNullable(projects);

	return (
		<List>
			{projects.map((project) => {
				const hovered = project.id === hoveredProjectId;

				return (
					<ListItem
						key={project.id}
						disablePadding
						onMouseEnter={getHoveredProjectUpdater(project.id)}
						onMouseLeave={getHoveredProjectUpdater(null)}
						sx={{
							// Defining a minHeight to accomodate enough height for the actions to prevent weird shifts
							minHeight: PROJECT_ACTIONS_HEIGHT,
						}}
					>
						<ListItemLinkButton
							sx={{
								// it needs a minWidth to wrap
								minWidth: 0,
								flex: 1,
							}}
							href={getRouteToProject({
								organizationId: project.organization.id,
								projectId: project.id,
							})}
						>
							<ListItemText
								primaryTypographyProps={{ noWrap: !mobileDrawerEnabled }}
								inset
								title={mobileDrawerEnabled ? undefined : project.name}
							>
								{project.name}
							</ListItemText>
						</ListItemLinkButton>
						{hovered && (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flexGrow: 0,
									flexShrink: 0,
									height: PROJECT_ACTIONS_HEIGHT,
								}}
							>
								<Tooltip title="Create ticket">
									<IconButton
										onClick={getCreateTicketForProjectHandler(project.id)}
									>
										<AddIcon />
									</IconButton>
								</Tooltip>
								<Tooltip
									title="Go to settings"
									sx={{
										marginLeft: 0.5,
									}}
								>
									<IconButton
										component={Link}
										noLinkStyle
										href={getRouteToProjectSettings({
											organizationId: project.organization.id,
											projectId: project.id,
										})}
									>
										<SettingsOutlinedIcon />
									</IconButton>
								</Tooltip>
							</Box>
						)}
					</ListItem>
				);
			})}
		</List>
	);
};

export default ProjectsList;
