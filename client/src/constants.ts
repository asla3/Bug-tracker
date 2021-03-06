export const MAX_ATTACHMENT_SIZE = 10485760; // 10 MB

export const MEMBERSHIP_ROLE = {
	ADMIN: 'Admin',
	PROJECT_MANAGER: 'Project manager',
	DEVELOPER: 'Developer',
} as const;

export const MEMBERSHIP_STATUS_OPTIONS = {
	ACTIVE: 'Active',
	INACTIVE: 'Inactive',
	PENDING: 'Pending',
} as const;

export const TICKET_PRIORITY_OPTIONS = {
	HIGH: 'High',
	MEDIUM: 'Medium',
	LOW: 'Low',
} as const;

export const TICKET_TYPE_OPTIONS = {
	BUG: 'Bug',
	FEATURE_REQUEST: 'Feature request',
} as const;

/*
	Form errors
*/

export const REQUIRED_FIELD_ERROR_MESSAGE = 'This field is required.';

/*
	Form errors end
*/
