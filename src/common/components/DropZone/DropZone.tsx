import * as React from 'react';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Box, { BoxProps } from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';

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
}

const DESCRIPTION_CONTAINER_COMPONENT = 'span';

const DESCRIPTION_CONFIG = { component: 'span', variant: 'subtitle1' } as const;

const DescriptionContainer = styled(Box)<
	BoxProps<
		typeof DESCRIPTION_CONTAINER_COMPONENT,
		{ component: typeof DESCRIPTION_CONTAINER_COMPONENT }
	>
>({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const Description = styled(Typography)<
	TypographyProps<
		typeof DESCRIPTION_CONFIG.component,
		{ component: typeof DESCRIPTION_CONFIG.component }
	>
>(({ theme }) => ({
	marginLeft: theme.spacing(1),
}));

const BrowseButton = styled(ButtonBase)(({ theme }) => ({
	color: theme.palette.primary.main,
	fontSize: theme.typography[DESCRIPTION_CONFIG.variant].fontSize,
	fontFamily: theme.typography[DESCRIPTION_CONFIG.variant].fontFamily,
	lineHeight: theme.typography[DESCRIPTION_CONFIG.variant].lineHeight,
}));

/**
 * Allows adding attachments by either dragging and dropping
 * them directly into the drop zone or by uploading them to the file input.
 */
const DropZone = ({ onFileAttached }: DropZoneProps) => {
	// TODO: we'll use this state later to add different styles when the user is dragging files
	const [, setIsDraggingFile] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const preventDefaultDragBehaviour = (
		event: React.DragEvent<HTMLDivElement>
	) => event.preventDefault();

	const handleDragEnter = () => setIsDraggingFile(true);

	const handleDragLeave = () => setIsDraggingFile(false);

	const handleDrop = () => setIsDraggingFile(false);

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

	return (
		<div
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={preventDefaultDragBehaviour}
			onDrop={callAll(
				preventDefaultDragBehaviour,
				handleDrop,
				handleFileUpload
			)}
		>
			<input
				type="file"
				style={{ display: 'none' }}
				ref={fileInputRef}
				onChange={handleFileUpload}
				multiple
			/>
			<DescriptionContainer component={DESCRIPTION_CONTAINER_COMPONENT}>
				<CloudUploadOutlinedIcon />
				<Description
					component={DESCRIPTION_CONFIG.component}
					variant={DESCRIPTION_CONFIG.variant}
				>
					Drop files to attach or&nbsp;
				</Description>
				<BrowseButton onClick={browseFiles} focusRipple>
					browse
				</BrowseButton>
			</DescriptionContainer>
		</div>
	);
};

export default DropZone;
