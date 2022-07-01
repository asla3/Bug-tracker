import * as React from 'react';

import type {
	RichTextEditorProps as MantineRichTextEditorProps,
	Editor,
} from '@mantine/rte';
import { useFormControl } from '@mui/material/FormControl';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';

import callAll from '@/common/utils/callAll';

import isEditorEmpty from './helpers/isEditorEmpty';

export interface RichTextEditorBaseProps extends MantineRichTextEditorProps {
	/**
	 * If `true`, the component will indicate an error. The prop defaults to the value inherited from the parent FormControl component.
	 */
	error?: boolean;
}

interface RefForwarderProps extends MantineRichTextEditorProps {
	forwardedRef?: React.Ref<Editor>;
}

const DynamicMantineRichTextEditor = dynamic(
	async () => {
		const { default: MantineRichTextEditor } = await import('@mantine/rte');

		const RefForwarder = ({ forwardedRef, ...props }: RefForwarderProps) => (
			<MantineRichTextEditor ref={forwardedRef} {...props} />
		);

		return RefForwarder;
	},
	{
		ssr: false,
		// we might want to remove this and instead turn on `Suspense`. This way we can use different fallbkacks per use case, useful in those cases where we might want to use a custom width and/or height for the rich text editor and we want the fallback that match those dimensions.
		loading: () => <Skeleton variant="rectangular" />, // TODO: we need to define a height for this. Not setting it now because I need to figure out how much height does Mantine use (doesn't seem to be a fixed value)
	}
);

/**
 *  Mantine based rich text editor that integrates with MUI's `<FormControl />`.
 */
const RichTextEditorBase = React.forwardRef<Editor, RichTextEditorBaseProps>(
	function RichTextEditorBase(
		{ onFocus, onBlur, error, sx, onChange, ...other },
		ref
	) {
		const [focused, setFocused] = React.useState(false);
		const muiFormControl = useFormControl();
		const theme = useTheme();

		const formControlState = {
			focused: muiFormControl ? muiFormControl.focused : focused,
			error: error ?? muiFormControl?.error,
		};

		const toggleFocused = () => setFocused(!focused);

		const handleChange: MantineRichTextEditorProps['onChange'] = (
			unsafe_value,
			delta,
			sources,
			editor
		) => {
			/*
				if the user has interacted with the rte, even when it's visibly empty, it's value will always contain html tags (when it's empty it's value will be <p><br/></p>). This is a problem because checks to determine if value is empty will never work. So instead we'll run some checks here to determine if the editor is empty (see isEditorEmpty), and if it is, we'll just pass an empty string to the onChange callback.
			 */
			const value = isEditorEmpty(editor) ? '' : unsafe_value;
			onChange(value, delta, sources, editor);
		};

		return (
			<DynamicMantineRichTextEditor
				{...other}
				onChange={handleChange}
				onFocus={callAll<React.FocusEvent<HTMLDivElement>[], void>(
					toggleFocused,
					muiFormControl?.onFocus,
					onFocus
				)}
				onBlur={callAll<React.FocusEvent<HTMLDivElement>[], void>(
					toggleFocused,
					muiFormControl?.onBlur,
					onBlur
				)}
				forwardedRef={ref}
				sx={{
					borderWidth: formControlState.focused ? 2 : undefined,
					borderColor: formControlState.error
						? theme.palette.error.main
						: formControlState.focused
						? theme.palette.primary.main
						: undefined,
					...(!(focused || error) && {
						'&:hover': {
							borderColor: theme.palette.text.primary,
						},
					}),
					...sx,
				}}
				aria-invalid={formControlState.error}
			/>
		);
	}
);

export type { Editor };

export default RichTextEditorBase;
