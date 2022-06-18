import * as React from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller, FieldValues } from 'react-hook-form';

import callAll from '@/common/utils/callAll';

import type { ElementsBaseProps } from '../../types';

export interface TextFieldElementProps<
	TFieldValues extends FieldValues = FieldValues
> extends Omit<TextFieldProps, 'defaultValue' | 'name' | 'value'>,
		ElementsBaseProps<TFieldValues> {}

const TextFieldElement = <TFieldValues extends FieldValues = FieldValues>({
	name,
	rules,
	shouldUnregister,
	control,
	defaultValue,
	onChange: onChangeProp,
	onBlur: onBlurProp,
	parseError,
	error: errorProp,
	helperText,
	...TextFieldProps
}: TextFieldElementProps<TFieldValues>) => {
	return (
		<Controller
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			control={control}
			defaultValue={defaultValue}
			render={({
				field: { ref, onChange, onBlur, ...field },
				fieldState: { error },
			}) => (
				<TextField
					{...TextFieldProps}
					{...field}
					onChange={callAll(onChange, onChangeProp)}
					onBlur={callAll<
						[
							event: React.FocusEvent<
								HTMLInputElement | HTMLTextAreaElement,
								Element
							>
						],
						void
					>(onBlur, onBlurProp)}
					inputRef={ref}
					error={Boolean(error) || errorProp}
					helperText={
						(error && (parseError?.(error) ?? error.message)) || helperText
					}
				/>
			)}
		/>
	);
};

export default TextFieldElement;
