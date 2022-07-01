import Chip, { ChipProps, ChipTypeMap } from '@mui/material/Chip';

export type UserChipProps<
	C extends React.ElementType = ChipTypeMap['defaultComponent']
> = Omit<ChipProps<C>, 'color'>;

const UserChip = <
	C extends React.ElementType = ChipTypeMap['defaultComponent']
>(
	props: UserChipProps<C>
) => {
	return <Chip {...props} color="primary" />;
};

export default UserChip;
