import * as React from 'react';

import ArticleIcon from '@mui/icons-material/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import ListItemLinkButton from '@/common/components/ListItemLinkButton';
import { ErrorBoundary } from '@/modules/error-boundary';
import {
	getRouteToOrganizationProjects,
	getRouteToOrganizationSettings,
} from '@/routes';

import { DESKTOP_SIDEBAR_START } from '../constants';
import OrganizationHeader from './OrganizationHeader';
import ProjectsList from './ProjectsList';

export interface AppDrawerProps {
	currentOrganizationId: string;
	mobileDrawerOpen: boolean;
	onMobileDrawerClose: NonNullable<DrawerProps['onClose']>;
	sx?: DrawerProps['sx'];
}

const PROJECTS_LIST_EXPANDABLE_CONTAINER_ID =
	'projects-list-expandable-container';

const AppDrawer = ({
	currentOrganizationId,
	mobileDrawerOpen,
	onMobileDrawerClose,
	sx = [],
}: AppDrawerProps) => {
	const [projectsExpanded, setProjectsExpanded] = React.useState(false);

	const mobileDrawerEnabled = useMediaQuery<Theme>((theme) =>
		theme.breakpoints.down(DESKTOP_SIDEBAR_START)
	);

	const toggleProjects = () => setProjectsExpanded(!projectsExpanded);

	return (
		<Drawer
			variant={mobileDrawerEnabled ? 'temporary' : 'permanent'}
			open={mobileDrawerEnabled ? mobileDrawerOpen : undefined}
			onClose={mobileDrawerEnabled ? onMobileDrawerClose : undefined}
			ModalProps={mobileDrawerEnabled ? { keepMounted: true } : undefined}
			sx={[
				{
					'& .MuiDrawer-paper': {
						maxWidth: '80%',
						boxSizing: 'border-box',
					},
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<ErrorBoundary>
				<ErrorBoundary>
					<OrganizationHeader currentOrganizationId={currentOrganizationId} />
				</ErrorBoundary>
				<Divider />
				<ErrorBoundary>
					<List>
						<ListItem sx={{ display: 'block' }} disablePadding>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<ListItemLinkButton
									href={getRouteToOrganizationProjects({
										organizationId: currentOrganizationId,
									})}
									sx={{
										flex: 1,
									}}
								>
									<ListItemIcon>
										<ArticleIcon />
									</ListItemIcon>
									<ListItemText>Projects</ListItemText>
								</ListItemLinkButton>
								<IconButton
									onClick={toggleProjects}
									aria-label={
										projectsExpanded ? 'Hide all projects' : 'Show all projects'
									}
									sx={{ flexGrow: 0, flexShrink: 0 }}
									aria-controls={PROJECTS_LIST_EXPANDABLE_CONTAINER_ID}
									aria-expanded={projectsExpanded}
								>
									{projectsExpanded ? <ExpandLess /> : <ExpandMore />}
								</IconButton>
							</Box>
							<Collapse
								id={PROJECTS_LIST_EXPANDABLE_CONTAINER_ID}
								in={projectsExpanded}
								timeout="auto"
								aria-hidden={!projectsExpanded}
							>
								<ErrorBoundary>
									<ProjectsList
										currentOrganizationId={currentOrganizationId}
										mobileDrawerEnabled={mobileDrawerEnabled}
									/>
								</ErrorBoundary>
							</Collapse>
						</ListItem>
						<Divider />
						<ListItem disablePadding>
							<ListItemLinkButton
								href={getRouteToOrganizationSettings({
									organizationId: currentOrganizationId,
								})}
							>
								<ListItemIcon>
									<SettingsOutlinedIcon />
								</ListItemIcon>
								<ListItemText>Organization settings</ListItemText>
							</ListItemLinkButton>
						</ListItem>
					</List>
				</ErrorBoundary>
			</ErrorBoundary>
		</Drawer>
	);
};

export default AppDrawer;
