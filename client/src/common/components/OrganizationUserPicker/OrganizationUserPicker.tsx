import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import type { Membership } from '@/api/types';
import Autocomplete, {
	AutocompleteProps,
} from '@/common/components/Autocomplete';
import UserChip from '@/common/components/UserChip';

export interface OrganizationUserPickerProps<
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined
> extends Omit<
		AutocompleteProps<Membership, TMultiple, TDisableClearable, undefined>,
		| 'options'
		| 'getOptionLabel'
		| 'isOptionEqualToValue'
		| 'renderTags'
		| 'renderInput'
		| 'renderOption'
		| 'freeSolo' // might support this in the future if necessary
	> {
	/**
	 * Organization's memberships that will be used to extract the users and display them as options.
	 */
	memberships: Membership[];
}

const AVATAR_DIMENSIONS = { width: 20, height: 20 } as const;

const getMembershipLabel = (membership: Membership) =>
	membership.user?.name || membership.invitation.email;

const OrganizationUserPicker = <
	TMultiple extends boolean | undefined = undefined,
	TDisableClearable extends boolean | undefined = undefined
>({
	multiple,
	memberships,
	limitTags,
	TextFieldProps,
	...props
}: OrganizationUserPickerProps<TMultiple, TDisableClearable>) => {
	return (
		<Autocomplete
			{...props}
			options={memberships}
			getOptionLabel={getMembershipLabel}
			multiple={multiple}
			isOptionEqualToValue={(membershipOption, selectedMembership) =>
				membershipOption.id === selectedMembership.id
			}
			renderTags={(selectedMemberships, getProps) =>
				selectedMemberships.map((selectedMembership, index) => (
					<UserChip
						{...getProps({ index })}
						label={getMembershipLabel(selectedMembership)}
						avatar={<Avatar alt="" src={selectedMembership.user?.avatarUrl} />}
						key={selectedMembership.id} //even though getProps gives us a key, it's index based so let's just use id as a key
					/>
				))
			}
			renderInput={(params, currentValue) => {
				const startAdornment =
					params.InputProps.startAdornment ||
					// checks to know if we should show a profile picture for the user the selected membership belongs to (only when the Autocomplete can only hold a single value)
					(!multiple &&
						currentValue &&
						// this should be impossible because `multiple` is `false` , but typescript is not inferring it
						!Array.isArray(currentValue) &&
						// show the profile picture if the user hasn't changed the input value
						params.inputProps.value === getMembershipLabel(currentValue) && (
							<Avatar
								src={currentValue.user?.avatarUrl}
								alt=""
								sx={AVATAR_DIMENSIONS}
							/>
						)) ||
					TextFieldProps?.InputProps?.startAdornment;

				return (
					<TextField
						{...params}
						{...TextFieldProps}
						InputProps={{
							...params.InputProps,
							...TextFieldProps?.InputProps,
							startAdornment,
						}}
					/>
				);
			}}
			renderOption={(props, membershipOption) => (
				<Box
					{...props}
					component="li"
					sx={{ display: 'flex', alignItems: 'center' }}
				>
					<Avatar
						src={membershipOption.user?.avatarUrl}
						alt=""
						sx={AVATAR_DIMENSIONS}
					/>
					<Box component="span" sx={{ marginLeft: 0.75 }}>
						{getMembershipLabel(membershipOption)}
					</Box>
				</Box>
			)}
			limitTags={limitTags ?? 6}
		/>
	);
};

export default OrganizationUserPicker;
