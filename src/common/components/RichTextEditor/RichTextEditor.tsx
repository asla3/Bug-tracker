import * as React from 'react';

import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText, {
	FormHelperTextProps as TFormHelperTextProps,
} from '@mui/material/FormHelperText';
import {
	unstable_useId as useId,
	unstable_useForkRef as useForkRef,
} from '@mui/utils';

import RichTextEditorBase, {
	RichTextEditorBaseProps as TRichTextEditorBaseProps,
	Editor,
} from '@/common/components/RichTextEditorBase';
import StaticInputLabel, {
	StaticInputLabelProps as TStaticInputLabelProps,
} from '@/common/components/StaticInputLabel';
import callAll from '@/common/utils/callAll';

export interface RichTextEditorProps
	//TODO: add support for fullwidth and sizing, and consider supporting more styling props from `FormControl`.
	extends Pick<TRichTextEditorBaseProps, 'value' | 'onChange' | 'id'>,
		Pick<
			FormControlProps,
			'required' | 'margin' | 'error' | 'disabled' | 'onBlur' | 'onFocus' | 'sx'
		> {
	/**
	 * Content to use for the label.
	 */
	label?: React.ReactNode;
	/**
	 * Content to use to give users a description of the field.
	 */
	helperText?: React.ReactNode;
	/**
	 * Props spread to the `StaticInputLabel` component.
	 * */
	StaticInputLabelProps?: TStaticInputLabelProps;
	/**
	 * Props spread to the `FormHelperText` component.
	 */
	FormHelperTextProps?: TFormHelperTextProps;
	/**
	 * Props spread to the `RichTextEditorBase` component.
	 */
	RichTextEditorBaseProps?: Omit<
		TRichTextEditorBaseProps,
		'value' | 'onChange' | 'id'
	>;
	/**
	 * Ref forwarded to the rich text editor.
	 */
	innerRef?: React.Ref<Editor>;
}

/**
 * Wrapper for `RichTextEditorBase` that adds support for `label` and `helperText`.
 */
const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
	function RichTextEditor(
		{
			value,
			onChange,
			id: overridableId,
			label,
			required,
			helperText,
			onBlur,
			onFocus,
			disabled,
			error,
			margin,
			RichTextEditorBaseProps,
			FormHelperTextProps: {
				id: FormHelperTextId,
				...FormHelperTextProps
			} = {},
			StaticInputLabelProps: {
				onClick: StaticInputLabelOnClick,
				id: StaticInputLabelId,
				...StaticInputLabelProps
			} = {},
			sx,
			innerRef,
		},
		rootRef
	) {
		const richTextEditorRef = React.useRef<Editor>(null);
		const handleRichTextEditorRef = useForkRef(richTextEditorRef, innerRef);

		const id = useId(overridableId);
		const labelId = label && id ? `${id}-label` : undefined;
		const helperTextId = helperText && id ? `${id}-helper-text` : undefined;

		const focusEditor = () => richTextEditorRef.current?.focus();

		return (
			<FormControl
				required={required}
				onBlur={onBlur}
				onFocus={onFocus}
				disabled={disabled}
				error={error}
				margin={margin}
				sx={sx}
				ref={rootRef}
			>
				{label && (
					<StaticInputLabel
						onClick={callAll<React.MouseEvent<HTMLLabelElement>[], void>(
							focusEditor,
							StaticInputLabelOnClick
						)}
						id={
							labelId && StaticInputLabelId
								? `${labelId} ${StaticInputLabelId}`
								: labelId || StaticInputLabelId
						}
						{...StaticInputLabelProps}
					>
						{label}
					</StaticInputLabel>
				)}
				<RichTextEditorBase
					value={value}
					onChange={onChange}
					id={id}
					ref={handleRichTextEditorRef}
					aria-labelledby={labelId}
					aria-describedby={helperTextId}
					{...RichTextEditorBaseProps}
				/>
				{helperText && (
					<FormHelperText
						id={
							helperTextId && FormHelperTextId
								? `${helperTextId} ${FormHelperTextId}`
								: helperTextId || FormHelperTextId
						}
						{...FormHelperTextProps}
					>
						{helperText}
					</FormHelperText>
				)}
			</FormControl>
		);
	}
);

export default RichTextEditor;
