import * as React from 'react';

import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText, {
	FormHelperTextProps as TFormHelperTextProps,
} from '@mui/material/FormHelperText';
import InputLabel, {
	InputLabelProps as TInputLabelProps,
} from '@mui/material/InputLabel';
import { unstable_useId } from '@mui/utils';

import RichTextEditorBase, {
	RichTextEditorBaseProps as TRichTextEditorBaseProps,
	Editor,
} from '@/common/components/RichTextEditorBase';
import callAll from '@/common/utils/callAll';

export interface RichTextEditorProps
	//TODO: add support for fullwidth and sizing
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
	 * Props spread to the `InputLabel` component.
	 * */
	InputLabelProps?: TInputLabelProps;
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
}

/**
 * Wrapper for `RichTextEditorBase` that adds support for `label` and `helperText`.
 */
const RichTextEditor = ({
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
	FormHelperTextProps: { id: FormHelperTextId, ...FormHelperTextProps } = {},
	InputLabelProps: {
		onClick: InputLabelOnClick,
		sx: InputLabelSx = [],
		id: InputLabelId,
		...InputLabelProps
	} = {},
	sx,
}: RichTextEditorProps) => {
	const richTextEditorRef = React.useRef<Editor>(null);

	const focusEditor = () => richTextEditorRef.current?.focus();

	const id = unstable_useId(overridableId);
	const labelId = label && id ? `${id}-label` : undefined;
	const helperTextId = helperText && id ? `${id}-helper-text` : undefined;

	return (
		<FormControl
			required={required}
			onBlur={onBlur}
			onFocus={onFocus}
			disabled={disabled}
			error={error}
			margin={margin}
			sx={sx}
		>
			{label && (
				<InputLabel
					shrink
					onClick={callAll<React.MouseEvent<HTMLLabelElement>[], void>(
						focusEditor,
						InputLabelOnClick
					)}
					id={
						labelId && InputLabelId
							? `${labelId} ${InputLabelId}`
							: labelId || InputLabelId
					}
					sx={[
						{ transform: 'none', marginBottom: 1, position: 'static' },
						...(Array.isArray(InputLabelSx) ? InputLabelSx : [InputLabelSx]),
					]}
					{...InputLabelProps}
				>
					{label}
				</InputLabel>
			)}
			<RichTextEditorBase
				value={value}
				onChange={onChange}
				id={id}
				ref={richTextEditorRef}
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
};

export default RichTextEditor;
