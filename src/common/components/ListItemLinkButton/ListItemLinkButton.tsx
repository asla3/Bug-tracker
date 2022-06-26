import MuiListItemButton, {
	ListItemButtonProps as MuiListItemButtonProps,
} from '@mui/material/ListItemButton';
import { useRouter } from 'next/router';

import Link from '@/common/components/Link';
import isLinkRouteActive from '@/common/utils/isLinkRouteActive';

export type ListItemLinkButtonProps = MuiListItemButtonProps<typeof Link>;

const ListItemLinkButton = ({
	href,
	selected,
	...props
}: ListItemLinkButtonProps) => {
	const { asPath } = useRouter();

	const hrefIsActive = isLinkRouteActive(href, asPath);

	return (
		<MuiListItemButton
			{...props}
			component={Link}
			href={href}
			selected={selected ?? hrefIsActive}
			noLinkStyle
		/>
	);
};

export default ListItemLinkButton;
