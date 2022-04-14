import * as React from 'react';

import type { AutocompleteValue as MuiAutocompleteValue } from '@mui/base/AutocompleteUnstyled';
import MuiAutocomplete, {
	AutocompleteProps as MuiAutocompleteProps,
	AutocompleteRenderInputParams as MuiAutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import { unstable_useControlled as useControlled } from '@mui/utils';

import callAll from '@/common/utils/callAll';

export interface AutocompleteProps<
	T,
	Multiple extends boolean | undefined = undefined,
	DisableClearable extends boolean | undefined = undefined,
	FreeSolo extends boolean | undefined = undefined,
	ChipComponent extends React.ElementType<any> = 'div'
> extends Omit<
		MuiAutocompleteProps<
			T,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>,
		'renderInput'
	> {
	/**
	 * Renders the input.
	 */
	renderInput: (
		params: MuiAutocompleteRenderInputParams,
		selectedOption: MuiAutocompleteValue<
			T,
			Multiple,
			DisableClearable,
			FreeSolo
		> | null // Have to add `null` because MuiAutocompleteValue only returns a union that contains `null` when `disableClearable` is `false`.
	) => React.ReactNode;
}

/**
 * Extended MUI `<Autocomplete />`.
 */
const Autocomplete = <
	T,
	Multiple extends boolean | undefined = undefined,
	DisableClearable extends boolean | undefined = undefined,
	FreeSolo extends boolean | undefined = undefined,
	ChipComponent extends React.ElementType<any> = 'div'
>({
	value: valueProp,
	renderInput: renderInputProp,
	multiple,
	onChange,
	// @ts-ignore
	defaultValue = multiple ? [] : null,
	...props
}: AutocompleteProps<
	T,
	Multiple,
	DisableClearable,
	FreeSolo,
	ChipComponent
>) => {
	const [value, setValue] = useControlled({
		controlled: valueProp,
		default: defaultValue,
		name: 'Autocomplete',
	});

	const handleChange: MuiAutocompleteProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo
	>['onChange'] = (event, value) => setValue(value);

	const renderInput: MuiAutocompleteProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo
	>['renderInput'] = (params) => renderInputProp(params, value);

	return (
		<MuiAutocomplete
			{...props}
			value={value}
			multiple={multiple}
			onChange={callAll(handleChange, onChange)}
			renderInput={renderInput}
		/>
	);
};

export default Autocomplete;
