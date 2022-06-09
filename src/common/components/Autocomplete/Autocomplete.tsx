import * as React from 'react';

import type { AutocompleteFreeSoloValueMapping as MuiAutocompleteFreeSoloValueMapping } from '@mui/base/AutocompleteUnstyled';
import MuiAutocomplete, {
	AutocompleteProps as MuiAutocompleteProps,
	AutocompleteRenderInputParams as MuiAutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { unstable_useControlled as useControlled } from '@mui/utils';

import callAll from '@/common/utils/callAll';

//	todo overwrite MUI's `value` prop so it can accept `null` as value when `disableClearable` is true.
interface AutocompleteBaseProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
	ChipComponent extends React.ElementType<any>
> extends Omit<
		MuiAutocompleteProps<
			T,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>,
		'renderInput'
	> {}

/* 
	defining our own AutocompleteValue because mui's says that the value can't be `null`
	when `disableClearable` is `true`, even though the initial value for an uncontrolled `Autocomplete`
	when `multiple` is `false` will always be `null`.
*/
type AutocompleteValue<
	T,
	Multiple extends boolean | undefined,
	FreeSolo extends boolean | undefined
> = Multiple extends undefined | false
	? T | null | MuiAutocompleteFreeSoloValueMapping<FreeSolo>
	: Array<T | MuiAutocompleteFreeSoloValueMapping<FreeSolo>>;

interface AutocompleteWithRenderInputProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
	ChipComponent extends React.ElementType<any>
> extends AutocompleteBaseProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo,
		ChipComponent
	> {
	renderInput: (
		params: MuiAutocompleteRenderInputParams,
		value: AutocompleteValue<T, Multiple, FreeSolo>
	) => React.ReactNode;
	inputProps?: never;
}

interface AutocompleteWithoutRenderInputProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
	ChipComponent extends React.ElementType<any>
> extends AutocompleteBaseProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo,
		ChipComponent
	> {
	inputProps?: Omit<TextFieldProps, keyof MuiAutocompleteRenderInputParams>;
	renderInput?: never;
}

type AutocompleteProps<
	T,
	Multiple extends boolean | undefined = undefined,
	DisableClearable extends boolean | undefined = undefined,
	FreeSolo extends boolean | undefined = undefined,
	ChipComponent extends React.ElementType<any> = 'div'
> =
	| AutocompleteWithRenderInputProps<
			T,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
	  >
	| AutocompleteWithoutRenderInputProps<
			T,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
	  >;

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
	// Assign same values to `Autocomplete`s with multiple selections to keep consistency.
	disableCloseOnSelect = multiple || undefined,
	filterSelectedOptions = multiple || undefined,
	inputProps,
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
	}); // todo: we might want to create our own `useControlled` hook so we can customize the error message

	const handleChange: MuiAutocompleteProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo,
		ChipComponent
	>['onChange'] = (event, value) => setValue(value);

	const renderInput: MuiAutocompleteProps<
		T,
		Multiple,
		DisableClearable,
		FreeSolo,
		ChipComponent
	>['renderInput'] = (params) => {
		if (renderInputProp) {
			return renderInputProp(params, value);
		}

		return <TextField {...params} {...inputProps} />;
	};

	return (
		<MuiAutocomplete
			{...props}
			value={value}
			multiple={multiple}
			disableCloseOnSelect={disableCloseOnSelect}
			filterSelectedOptions={filterSelectedOptions}
			onChange={callAll(handleChange, onChange)}
			renderInput={renderInput}
		/>
	);
};

export * from '@mui/material/Autocomplete';

//overwrite exports from mui
export type { AutocompleteProps, AutocompleteValue };

export default Autocomplete;
