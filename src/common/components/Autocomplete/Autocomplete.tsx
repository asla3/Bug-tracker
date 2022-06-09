import * as React from 'react';

import type { AutocompleteFreeSoloValueMapping as MuiAutocompleteFreeSoloValueMapping } from '@mui/base/AutocompleteUnstyled';
import MuiAutocomplete, {
	AutocompleteProps as MuiAutocompleteProps,
	AutocompleteRenderInputParams as MuiAutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import type { ChipTypeMap } from '@mui/material/Chip';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { unstable_useControlled as useControlled } from '@mui/utils';

import callAll from '@/common/utils/callAll';

//	todo overwrite MUI's `value` prop so it can accept `null` as value when `disableClearable` is true.
interface AutocompleteBaseProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>
> extends Omit<
		MuiAutocompleteProps<
			T,
			TMultiple,
			TDisableClearable,
			TFreeSolo,
			TChipComponent
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
	TMultiple extends boolean | undefined,
	TFreeSolo extends boolean | undefined
> = TMultiple extends undefined | false
	? T | null | MuiAutocompleteFreeSoloValueMapping<TFreeSolo>
	: Array<T | MuiAutocompleteFreeSoloValueMapping<TFreeSolo>>;

interface AutocompleteWithRenderInputProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>
> extends AutocompleteBaseProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent
	> {
	renderInput: (
		params: MuiAutocompleteRenderInputParams,
		value: AutocompleteValue<T, TMultiple, TFreeSolo>
	) => React.ReactNode;
	inputProps?: never;
}

interface AutocompleteWithoutRenderInputProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>
> extends AutocompleteBaseProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent
	> {
	inputProps?: Omit<TextFieldProps, keyof MuiAutocompleteRenderInputParams>;
	renderInput?: never;
}

export type DefaultChipComponent = ChipTypeMap['defaultComponent'];

type AutocompleteProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any> = DefaultChipComponent
> =
	| AutocompleteWithRenderInputProps<
			T,
			TMultiple,
			TDisableClearable,
			TFreeSolo,
			TChipComponent
	  >
	| AutocompleteWithoutRenderInputProps<
			T,
			TMultiple,
			TDisableClearable,
			TFreeSolo,
			TChipComponent
	  >;

const Autocomplete = <
	T,
	TMultiple extends boolean | undefined = undefined,
	TDisableClearable extends boolean | undefined = undefined,
	TFreeSolo extends boolean | undefined = undefined,
	TChipComponent extends React.ElementType<any> = DefaultChipComponent
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
	TMultiple,
	TDisableClearable,
	TFreeSolo,
	TChipComponent
>) => {
	const [value, setValue] = useControlled({
		controlled: valueProp,
		default: defaultValue,
		name: 'Autocomplete',
	}); // todo: we might want to create our own `useControlled` hook so we can customize the error message

	const handleChange: MuiAutocompleteProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent
	>['onChange'] = (event, value) => setValue(value);

	const renderInput: MuiAutocompleteProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent
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
