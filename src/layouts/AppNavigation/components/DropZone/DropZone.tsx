import * as React from 'react';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { unstable_useId } from '@mui/utils';

import StaticInputLabel, {
	StaticInputLabelProps as TStaticInputLabelProps,
} from '@/common/components/StaticInputLabel';
import callAll from '@/common/utils/callAll';
import hasOwnProperty from '@/common/utils/hasOwnProperty';

export interface DropZoneProps {
	/**
	 * Callback fired when a file is uploaded,
	 * either by dropping it directly into the drop zone or by using the file input.
	 */
	onFileAttached: (
		event:
			| React.DragEvent<HTMLDivElement>
			| React.ChangeEvent<HTMLInputElement>,
		files: FileList,
		eventType: 'onChange' | 'drop'
	) => void;
	/**
	 * Content for the label element.
	 */
	label?: React.ReactNode;
	/**
	 * Props spread to the `StaticInputLabel` component.
	 */
	StaticInputLabelProps?: TStaticInputLabelProps;
	id?: string;
}

const DESCRIPTION_TEXT_CONFIG = {
	component: 'span',
	variant: 'subtitle1',
} as const;

/**
 * Allows adding attachments by either dragging and dropping
 * them directly into the drop zone or by uploading them to the file input.
 */
const DropZone = ({
	onFileAttached,
	id: overridableId,
	label,
	StaticInputLabelProps: {
		onClick: StaticInputLabelOnClick,
		id: StaticInputLabelId,
		...StaticInputLabelProps
	} = {},
}: DropZoneProps) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [dropDepth, setDropDepth] = React.useState(0);
	const fileIsBeingDragged = dropDepth > 0;

	const preventFileOpen = (event: React.DragEvent<HTMLDivElement>) =>
		event.preventDefault();

	const handleDragEnter = () => setDropDepth(dropDepth + 1);

	const handleDragLeave = () => setDropDepth(dropDepth - 1);

	const handleDrop = () => setDropDepth(0);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) =>
		(event.dataTransfer.dropEffect = 'copy');

	const handleFileUpload = (
		event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>
	) => {
		const isDropEvent = hasOwnProperty(event, 'dataTransfer');
		const files = isDropEvent ? event.dataTransfer.files : event.target.files;
		// return early if no file was attached
		if (!files || files.length === 0) {
			return;
		}
		const eventType = isDropEvent ? 'drop' : 'onChange';
		onFileAttached(event, files, eventType);
	};

	const browseFiles = () => fileInputRef.current?.click();

	const id = unstable_useId(overridableId);
	const labelId = label && id ? `${id}-label` : undefined;

	return (
		<>
			{label && (
				<StaticInputLabel
					id={
						labelId && StaticInputLabelId
							? `${labelId} ${StaticInputLabelId}`
							: labelId || StaticInputLabelId
					}
					focused={fileIsBeingDragged}
					onClick={callAll<React.MouseEvent<HTMLLabelElement>[], void>(
						browseFiles,
						StaticInputLabelOnClick
					)}
					{...StaticInputLabelProps}
				>
					{label}
				</StaticInputLabel>
			)}
			<Box
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={callAll(preventFileOpen, handleDragOver)}
				onDrop={callAll(preventFileOpen, handleDrop, handleFileUpload)}
				sx={(theme) => ({
					borderStyle: 'dashed',
					borderWidth: fileIsBeingDragged ? 2 : 1,
					borderColor: fileIsBeingDragged
						? theme.palette.primary.main
						: theme.palette.text.primary,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					minHeight: fileIsBeingDragged ? 75 : 50,
				})}
				id={id}
				aria-labelledby={labelId}
			>
				<input
					type="file"
					style={{ display: 'none' }}
					ref={fileInputRef}
					onChange={handleFileUpload}
					multiple
				/>
				<Box
					component="span"
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						opacity: fileIsBeingDragged ? 0.5 : 1,
					}}
				>
					<CloudUploadOutlinedIcon />
					<Typography
						component={DESCRIPTION_TEXT_CONFIG.component}
						variant={DESCRIPTION_TEXT_CONFIG.variant}
						sx={{ marginLeft: 1 }}
					>
						Drop files to attach or&nbsp;
					</Typography>
					<ButtonBase
						onClick={browseFiles}
						focusRipple
						sx={(theme) => ({
							color: theme.palette.primary.main,
							fontSize:
								theme.typography[DESCRIPTION_TEXT_CONFIG.variant].fontSize,
							fontFamily:
								theme.typography[DESCRIPTION_TEXT_CONFIG.variant].fontFamily,
							lineHeight:
								theme.typography[DESCRIPTION_TEXT_CONFIG.variant].lineHeight,
						})}
					>
						browse
					</ButtonBase>
				</Box>
			</Box>
		</>
	);
};

export default DropZone;
