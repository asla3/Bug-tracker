import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import type { OrganizationMembership } from '@/api/types';
import Autocomplete, {
	AutocompleteProps,
} from '@/common/components/Autocomplete';
import UserChip from '@/common/components/UserChip';

export interface OrganizationMembershipPickerProps<
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined
> extends Omit<
		AutocompleteProps<
			OrganizationMembership,
			TMultiple,
			TDisableClearable,
			undefined
		>,
		| 'options'
		| 'getOptionLabel'
		| 'isOptionEqualToValue'
		| 'renderTags'
		| 'renderInput'
		| 'renderOption'
		| 'freeSolo' // might support this in the future if necessary
	> {
	/**
	 * Organization memberships to be displayed as options.
	 */
	organizationMemberships: OrganizationMembership[];
}

const AVATAR_DIMENSIONS = { width: 20, height: 20 } as const;

const getOrganizationMembershipLabel = (
	organizationMembership: OrganizationMembership
) =>
	organizationMembership.user?.name || organizationMembership.invitation.email;

const OrganizationMembershipPicker = <
	TMultiple extends boolean | undefined = undefined,
	TDisableClearable extends boolean | undefined = undefined
>({
	multiple,
	organizationMemberships,
	limitTags,
	TextFieldProps,
	...props
}: OrganizationMembershipPickerProps<TMultiple, TDisableClearable>) => {
	return (
		<Autocomplete
			{...props}
			options={organizationMemberships}
			getOptionLabel={getOrganizationMembershipLabel}
			multiple={multiple}
			isOptionEqualToValue={(
				organizationMembershipOption,
				selectedOrganizationMembership
			) =>
				organizationMembershipOption.id === selectedOrganizationMembership.id
			}
			renderTags={(selectedOrganizationMemberships, getProps) =>
				selectedOrganizationMemberships.map(
					(selectedOrganizationMembership, index) => (
						<UserChip
							{...getProps({ index })}
							label={getOrganizationMembershipLabel(
								selectedOrganizationMembership
							)}
							avatar={
								<Avatar
									alt=""
									src={selectedOrganizationMembership.user?.avatarUrl}
								/>
							}
							key={selectedOrganizationMembership.id} //even though getProps gives us a key, it's index based so let's just use id as a key
						/>
					)
				)
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
						params.inputProps.value ===
							getOrganizationMembershipLabel(currentValue) && (
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
			renderOption={(props, organizationMembershipOption) => (
				<Box
					{...props}
					component="li"
					sx={{ display: 'flex', alignItems: 'center' }}
				>
					<Avatar
						src={organizationMembershipOption.user?.avatarUrl}
						alt=""
						sx={AVATAR_DIMENSIONS}
					/>
					<Box component="span" sx={{ marginLeft: 0.75 }}>
						{getOrganizationMembershipLabel(organizationMembershipOption)}
					</Box>
				</Box>
			)}
			limitTags={limitTags ?? 6}
		/>
	);
};

export default OrganizationMembershipPicker;
