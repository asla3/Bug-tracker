import * as React from 'react';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import FormHelperText from '@mui/material/FormHelperText';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { unstable_useId as useId } from '@mui/utils';

import StaticInputLabel, {
	StaticInputLabelProps as TStaticInputLabelProps,
} from '@/common/components/StaticInputLabel';
import callAll from '@/common/utils/callAll';
import filterFiles from '@/common/utils/filterFiles';
import hasOwnProperty from '@/common/utils/hasOwnProperty';

import formatBytes from '../../helpers/formatBytes';

export interface DropZoneProps {
	/**
	 * Callback fired when a valid file is uploaded,
	 * either by dropping it directly into the drop zone or by using the file input.
	 */
	onFileAttached: OnFileAttached;
	/**
	 * Content for the label element.
	 */
	label?: React.ReactNode;
	/**
	 * Props spread to the `StaticInputLabel` component.
	 */
	StaticInputLabelProps?: TStaticInputLabelProps;
	/**
	 * Maximum file size allowed (in bytes.)
	 */
	maxSize?: number;
	id?: string;
	sx?: SxProps<Theme>;
}

export interface OnFileAttached {
	(
		event:
			| React.DragEvent<HTMLDivElement>
			| React.ChangeEvent<HTMLInputElement>,
		files: File[],
		eventType: 'onChange' | 'drop'
	): void;
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
	maxSize,
	StaticInputLabelProps: {
		onClick: StaticInputLabelOnClick,
		id: StaticInputLabelId,
		...StaticInputLabelProps
	} = {},
	sx,
}: DropZoneProps) => {
	const [dropDepth, setDropDepth] = React.useState(0);
	const [error, setError] = React.useState<null | string>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
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
		const dropEvent = hasOwnProperty(event, 'dataTransfer');
		const filesAttached = dropEvent
			? event.dataTransfer.files
			: event.target.files;
		const { filteredFiles, filesFilteredOutCount } = filterFiles(
			filesAttached ? Array.from(filesAttached) : [],
			{
				maxSize,
			}
		);
		const error =
			filesFilteredOutCount && maxSize
				? `${filesFilteredOutCount} ${
						filesFilteredOutCount > 1 ? 'files' : 'file'
				  } couldn't be attached because only files that are smaller or equal to ${formatBytes(
						maxSize
				  )} are allowed.`
				: null;
		setError(error);
		// return early if no valid file was attached
		if (filteredFiles.length === 0) {
			return;
		}
		const eventType = dropEvent ? 'drop' : 'onChange';
		onFileAttached(event, filteredFiles, eventType);
	};

	const browseFiles = () => fileInputRef.current?.click();

	const id = useId(overridableId);
	const labelId = label && id ? `${id}-label` : undefined;

	return (
		<Box sx={sx}>
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
						: theme.palette.mode === 'light'
						? 'rgba(0, 0, 0, 0.23)'
						: 'rgba(255, 255, 255, 0.23)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					py: fileIsBeingDragged ? 2.5 : 1.5,
					...(!fileIsBeingDragged && {
						'&:hover': {
							borderColor: theme.palette.text.primary,
						},
					}),
				})}
				id={id}
				aria-labelledby={labelId}
			>
				<input
					type="file"
					style={{ display: 'none' }}
					ref={fileInputRef}
					onChange={handleFileUpload}
					value=""
					multiple
				/>
				<Box
					component="span"
					sx={(theme) => ({
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						color: theme.palette.text.secondary,
					})}
				>
					<CloudUploadOutlinedIcon />
					<Typography
						component={DESCRIPTION_TEXT_CONFIG.component}
						variant={DESCRIPTION_TEXT_CONFIG.variant}
						sx={{
							marginLeft: 1,
						}}
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
			{error && <FormHelperText error>{error}</FormHelperText>}
		</Box>
	);
};

export default DropZone;
