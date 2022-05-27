import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton, {
	ListItemButtonProps,
} from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';

import type { Organization, Project } from '@/api/types';
import Link from '@/common/components/Link';
import OrganizationSwitcher from '@/common/components/OrganizationSwitcher';
import isLinkRouteActive from '@/common/utils/isLinkRouteActive';
import { DESKTOP_SIDEBAR_START } from '@/constants';
import {
	getRouteToProject,
	getRouteToOrganizationProjects,
	getRouteToOrganizationSettings,
	getRouteToProjectSettings,
} from '@/routes';

export interface AppDrawerProps {
	organizations: Organization[];
	currentOrganization: Organization;
	projects: Project[];
	mobileDrawerOpen: boolean;
	onMobileDrawerClose: NonNullable<DrawerProps['onClose']>;
	sx?: DrawerProps['sx'];
}

interface ProjectItemProps {
	project: Project;
	hovered?: boolean;
	wrapText?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

interface OrganizationHeaderProps {
	organizations: Organization[];
	currentOrganization: Organization;
}

const flexStyles = { display: 'flex', alignItems: 'center' };

const fixedFlexWidthStyles = { flexGrow: 0, flexShrink: 0 };

export const ListItemLinkButton = ({
	href,
	as: asProp,
	selected,
	...props
}: Omit<ListItemButtonProps<typeof Link>, 'noLinkStyle'>) => {
	const { asPath } = useRouter();

	const linkRouteIsActive = isLinkRouteActive(asProp || href, asPath);

	return (
		<ListItemButton
			{...props}
			component={Link}
			noLinkStyle
			as={asProp}
			href={href}
			selected={selected || linkRouteIsActive}
		/>
	);
};

const AppDrawer = ({
	projects,
	organizations,
	currentOrganization,
	mobileDrawerOpen,
	onMobileDrawerClose,
	sx = [],
}: AppDrawerProps) => {
	const [projectsExpanded, setProjectsExpanded] = React.useState(false);
	const [hoveredProjectId, setHoveredProjectId] = React.useState<null | string>(
		null
	);
	const clientIsMobile = useMediaQuery<Theme>((theme) =>
		theme.breakpoints.down(DESKTOP_SIDEBAR_START)
	);

	const toggleProjects = () => setProjectsExpanded(!projectsExpanded);

	const getHoveredProjectIdUpdater = (projectId: string | null) => () =>
		setHoveredProjectId(projectId);

	return (
		<Drawer
			variant={clientIsMobile ? 'temporary' : 'permanent'}
			open={clientIsMobile ? mobileDrawerOpen : undefined}
			onClose={clientIsMobile ? onMobileDrawerClose : undefined}
			ModalProps={clientIsMobile ? { keepMounted: true } : undefined}
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
			<OrganizationHeader
				organizations={organizations}
				currentOrganization={currentOrganization}
			/>
			<List>
				<ListItem sx={{ display: 'block' }} disablePadding>
					<Box sx={flexStyles}>
						<ListItemLinkButton
							href={getRouteToOrganizationProjects({
								organizationId: currentOrganization.id,
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
							sx={fixedFlexWidthStyles}
						>
							{projectsExpanded ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</Box>
					<Collapse in={projectsExpanded} timeout="auto">
						<List>
							{projects.map((project) => (
								<ProjectItem
									key={project.id}
									project={project}
									hovered={project.id === hoveredProjectId}
									wrapText={!clientIsMobile}
									onMouseLeave={getHoveredProjectIdUpdater(null)}
									onMouseEnter={getHoveredProjectIdUpdater(project.id)}
								/>
							))}
						</List>
					</Collapse>
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<ListItemLinkButton
						href={getRouteToOrganizationSettings({
							organizationId: currentOrganization.id,
						})}
					>
						<ListItemIcon>
							<SettingsOutlinedIcon />
						</ListItemIcon>
						<ListItemText>Organization settings</ListItemText>
					</ListItemLinkButton>
				</ListItem>
			</List>
		</Drawer>
	);
};

const PROJECT_ITEM_ACTIONS_HEIGHT = 40;

const ProjectItem = ({
	project,
	wrapText,
	onMouseEnter,
	onMouseLeave,
	hovered,
}: ProjectItemProps) => {
	return (
		<ListItem
			disablePadding
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			sx={{
				/*
					Defining a minHeight to accomodate enough height for the actions to prevent weird shifts
				*/
				minHeight: PROJECT_ITEM_ACTIONS_HEIGHT,
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
					primaryTypographyProps={{ noWrap: !wrapText }}
					inset
					title={wrapText ? undefined : project.name}
				>
					{project.name}
				</ListItemText>
			</ListItemLinkButton>
			{hovered && (
				<Box
					sx={{
						...flexStyles,
						...fixedFlexWidthStyles,
						height: PROJECT_ITEM_ACTIONS_HEIGHT,
					}}
				>
					<Tooltip title="Add ticket">
						<IconButton>
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
};

const OrganizationHeader = ({
	organizations,
	currentOrganization,
}: OrganizationHeaderProps) => {
	const [organizationSwitcherAnchor, setOrganizationSwitcherAnchor] =
		React.useState<HTMLElement | null>(null);
	const organizationSwitcherIsOpen = Boolean(organizationSwitcherAnchor);

	const openOrganizationSwitcher = (
		event: React.MouseEvent<HTMLButtonElement>
	) => setOrganizationSwitcherAnchor(event.currentTarget);

	const closeOrganizationSwitcher = () => setOrganizationSwitcherAnchor(null);

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
					variant="text"
					onClick={openOrganizationSwitcher}
					sx={{ minWidth: 0, px: 0 }}
				>
					Switch
				</Button>
			</Box>
			<Divider />
			<OrganizationSwitcher
				organizations={organizations}
				anchorEl={organizationSwitcherAnchor}
				onClose={closeOrganizationSwitcher}
				open={organizationSwitcherIsOpen}
			/>
		</>
	);
};

export default AppDrawer;
