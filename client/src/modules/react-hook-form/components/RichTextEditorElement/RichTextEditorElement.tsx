import * as React from 'react';

import { Controller, FieldValues } from 'react-hook-form';

import RichTextEditor, {
	RichTextEditorProps,
} from '@/common/components/RichTextEditor';
import callAll from '@/common/utils/callAll';

import type { ElementsBaseProps } from '../../types';

export interface RichTextEditorElementProps<
	TFieldValues extends FieldValues = FieldValues
> extends Omit<RichTextEditorProps, 'onChange' | 'value'>,
		ElementsBaseProps<TFieldValues> {
	onChange?: RichTextEditorProps['onChange'];
}

const RichTextEditorElement = <TFieldValues extends FieldValues = FieldValues>({
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
	...RichTextFieldEditorProps
}: RichTextEditorElementProps<TFieldValues>) => {
	return (
		<Controller
			name={name}
			control={control}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			rules={rules}
			render={({
				field: { onChange, onBlur, ref, ...field },
				fieldState: { error },
			}) => (
				<RichTextEditor
					{...RichTextFieldEditorProps}
					{...field}
					onChange={callAll<
						Parameters<NonNullable<typeof onChangeProp>>,
						void | undefined
					>(onChange, onChangeProp)}
					onBlur={callAll<
						[event: React.FocusEvent<HTMLDivElement, Element>],
						void
					>(onBlur, onBlurProp)}
					innerRef={ref}
					error={Boolean(error) || errorProp}
					helperText={
						(error && (parseError?.(error) ?? error.message)) || helperText
					}
				/>
			)}
		/>
	);
};

export default RichTextEditorElement;
