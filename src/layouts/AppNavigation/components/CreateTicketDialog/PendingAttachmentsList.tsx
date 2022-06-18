import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { TicketPendingAttachment } from '@/api/types';
import formatBytes from '@/common/utils/formatBytes';
import getFileRepresentationFromMimeType from '@/common/utils/getFileRepresentationFromMimeType';

export interface PendingAttachmentsListProps {
	pendingAttachments: TicketPendingAttachment[];
	onAttachmentRemoved: (index: number) => void;
}

const SHOW_FILE_SIZE_MEDIA_QUERY = '@media screen and (min-width: 400px)';

const PendingAttachmentsList = ({
	pendingAttachments,
	onAttachmentRemoved,
}: PendingAttachmentsListProps) => {
	const getAttachmentRemovedHandler = (index: number) => () =>
		onAttachmentRemoved(index);

	return (
		<Box component="ul" sx={{ listStyleType: 'none', margin: 0, padding: 0 }}>
			{pendingAttachments.map((attachment, index) => {
				const { icon, color } = getFileRepresentationFromMimeType(
					attachment.file.type
				);
				return (
					<Paper
						component="li"
						sx={{ padding: 1, marginBottom: 1 }}
						elevation={2}
						key={attachment.id}
					>
						<Grid container alignItems="center" wrap="nowrap">
							<Grid item sx={{ color }}>
								<FontAwesomeIcon icon={icon} />
							</Grid>
							<Grid item sx={{ marginLeft: 1 }} zeroMinWidth>
								<Typography noWrap>{attachment.file.name}</Typography>
							</Grid>
							<Grid
								item
								sx={{
									display: 'none',
									[SHOW_FILE_SIZE_MEDIA_QUERY]: {
										display: 'block',
										marginLeft: 'auto',
									},
								}}
							>
								<Typography>{formatBytes(attachment.file.size)}</Typography>
							</Grid>
							<Grid
								item
								sx={{
									marginLeft: 'auto',
									[SHOW_FILE_SIZE_MEDIA_QUERY]: {
										marginLeft: 1,
									},
								}}
							>
								<IconButton
									onClick={getAttachmentRemovedHandler(index)}
									size="small"
								>
									<DeleteIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Paper>
				);
			})}
		</Box>
	);
};

export default PendingAttachmentsList;
