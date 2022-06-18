import {
	faFilePdf,
	faFileImage,
	faFileAudio,
	faFileVideo,
	faFileWord,
	faFileExcel,
	faFilePowerpoint,
	faFileText,
	faFileCode,
	faFileArchive,
	faFile,
	IconDefinition,
} from '@fortawesome/free-regular-svg-icons';

// based on @scand1sk's code: https://gist.github.com/colemanw/9c9a12aae16a4bfe2678de86b661d922?permalink_comment_id=3664153#gistcomment-3664153

export interface FileRepresentation {
	icon: IconDefinition;
	color: string;
}

// todo: every icon needs an unique color
export const fileRepresentationMap: {
	[key: string]: FileRepresentation | undefined;
} = {
	// Media
	image: { icon: faFileImage, color: '#000' },
	audio: { icon: faFileAudio, color: '#000' },
	video: { icon: faFileVideo, color: '#000' },
	// Documents
	'application/pdf': { icon: faFilePdf, color: '#000' },
	'application/msword': { icon: faFileWord, color: '#000' },
	'application/vnd.ms-word': { icon: faFileWord, color: '#000' },
	'application/vnd.oasis.opendocument.text': {
		icon: faFileWord,
		color: '#000',
	},
	'application/vnd.openxmlformats-officedocument.wordprocessingml': {
		icon: faFileWord,
		color: '#000',
	},
	'application/vnd.ms-excel': { icon: faFileExcel, color: '#000' },
	'application/vnd.openxmlformats-officedocument.spreadsheetml': {
		icon: faFileExcel,
		color: '#000',
	},
	'application/vnd.oasis.opendocument.spreadsheet': {
		icon: faFileExcel,
		color: '#000',
	},
	'application/vnd.ms-powerpoint': {
		icon: faFilePowerpoint,
		color: '#000',
	},
	'application/vnd.openxmlformats-officedocument.presentationml': {
		icon: faFilePowerpoint,
		color: '#000',
	},
	'application/vnd.oasis.opendocument.presentation': {
		icon: faFilePowerpoint,
		color: '#000',
	},
	'text/plain': { icon: faFileText, color: '#000' },
	'text/html': { icon: faFileCode, color: '#000' },
	'application/json': { icon: faFileCode, color: '#000' },
	// Archives
	'application/gzip': { icon: faFileArchive, color: '#000' },
	'application/zip': { icon: faFileArchive, color: '#000' },
};

export const defaultFileRepresentation: FileRepresentation = {
	icon: faFile,
	color: '#000',
};

const getFileRepresentationFromMimeType = (mimeType: string) => {
	const fileRepresentationCandidate = Object.entries(
		fileRepresentationMap
	).find(([key]) => mimeType.startsWith(key))?.[1];

	if (!fileRepresentationCandidate) {
		return defaultFileRepresentation;
	}

	return fileRepresentationCandidate;
};

export default getFileRepresentationFromMimeType;
