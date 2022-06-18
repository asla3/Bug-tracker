import * as React from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller, FieldValues, RefCallBack } from 'react-hook-form';

import Autocomplete, {
	AutocompleteProps,
	AutocompleteRenderInputParams,
	AutocompleteValue,
	DefaultChipComponent,
} from '@/common/components/Autocomplete';
import callAll from '@/common/utils/callAll';

import type { ElementsBaseProps } from '../../types';

interface AutocompleteElementBaseProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>,
	TFieldValues extends FieldValues
> extends Omit<
			AutocompleteProps<
				T,
				TMultiple,
				TDisableClearable,
				TFreeSolo,
				TChipComponent
			>,
			'defaultValue' | 'renderInput' | 'TextFieldProps'
		>,
		ElementsBaseProps<TFieldValues> {}

interface AutocompleteElementRenderInputParams
	extends AutocompleteRenderInputParams {
	inputRef: RefCallBack;
	error: boolean;
	helperText: React.ReactNode;
}

interface AutocompleteElementWithRenderInputProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>,
	TFieldValues extends FieldValues
> extends AutocompleteElementBaseProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent,
		TFieldValues
	> {
	renderInput: (
		params: AutocompleteElementRenderInputParams,
		value: AutocompleteValue<T, TMultiple, TFreeSolo>
	) => React.ReactNode;
	TextFieldProps?: never;
}

interface AutocompleteElementWithoutRenderInputProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any>,
	TFieldValues extends FieldValues
> extends AutocompleteElementBaseProps<
		T,
		TMultiple,
		TDisableClearable,
		TFreeSolo,
		TChipComponent,
		TFieldValues
	> {
	TextFieldProps?: TextFieldProps;
	renderInput?: never;
}

export type AutocompleteElementProps<
	T,
	TMultiple extends boolean | undefined,
	TDisableClearable extends boolean | undefined,
	TFreeSolo extends boolean | undefined,
	TChipComponent extends React.ElementType<any> = DefaultChipComponent,
	TFieldValues extends FieldValues = FieldValues
> =
	| AutocompleteElementWithRenderInputProps<
			T,
			TMultiple,
			TDisableClearable,
			TFreeSolo,
			TChipComponent,
			TFieldValues
	  >
	| AutocompleteElementWithoutRenderInputProps<
			T,
			TMultiple,
			TDisableClearable,
			TFreeSolo,
			TChipComponent,
			TFieldValues
	  >;

const AutocompleteElement = <
	T,
	TMultiple extends boolean | undefined = undefined,
	TDisableClearable extends boolean | undefined = undefined,
	TFreeSolo extends boolean | undefined = undefined,
	TChipComponent extends React.ElementType<any> = DefaultChipComponent,
	TFieldValues extends FieldValues = FieldValues
>({
	name,
	rules,
	shouldUnregister,
	control,
	defaultValue,
	parseError,
	onChange: onChangeProp,
	onBlur: onBlurProp,
	renderInput,
	TextFieldProps,
	...AutocompleteProps
}: AutocompleteElementProps<
	T,
	TMultiple,
	TDisableClearable,
	TFreeSolo,
	TChipComponent,
	TFieldValues
>) => {
	return (
		<Controller
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			control={control}
			defaultValue={defaultValue}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { error },
			}) => (
				<Autocomplete
					{...AutocompleteProps}
					onChange={(event, value, reason) => {
						onChange(value);
						onChangeProp?.(event, value, reason);
					}}
					onBlur={callAll<
						[event: React.FocusEvent<HTMLDivElement, Element>],
						void
					>(onBlur, onBlurProp)}
					value={value}
					renderInput={(params, value) => {
						const extendedParams: AutocompleteElementRenderInputParams = {
							...params,
							inputRef: ref,
							error: Boolean(error),
							helperText: error && (parseError?.(error) ?? error.message),
						};

						if (renderInput) {
							return renderInput(extendedParams, value);
						}

						return <TextField {...extendedParams} {...TextFieldProps} />;
					}}
				/>
			)}
		/>
	);
};

export default AutocompleteElement;
