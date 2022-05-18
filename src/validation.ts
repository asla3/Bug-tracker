import { z } from 'zod';

import {
	REQUIRED_FIELD_ERROR_MESSAGE,
	ORGANIZATION_MEMBER_ROLE_OPTIONS,
} from '@/constants';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarUrl: z.string(),
});

export const authPayloadSchema = z.object({
	token: z.string(),
	user: userSchema,
});

export const organizationMemberRolesSchema = z.nativeEnum(
	ORGANIZATION_MEMBER_ROLE_OPTIONS
);

export const organizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	imageUrl: z.string(),
	members: z.array(
		z.object({
			user: userSchema,
			role: organizationMemberRolesSchema,
		})
	),
});

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	organization: organizationSchema,
});

const ticketTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const ticketTypeAutocompleteSchema = z.object(
	{ ...ticketTypeSchema.shape },
	{ invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE }
);

const ticketPrioritySchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const ticketPriorityAutocompleteSchema = z.object(
	{ ...ticketPrioritySchema.shape },
	{ invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE }
);

export const ticketPendingAttachmentSchema = z.object({
	id: z.string(),
	file: typeof File !== 'undefined' ? z.string() : z.any(), // `File` doesn't exist during build time so we have to check before creating the schema
});

export const ticketSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	// todo: attachments: z.array(attachmentSchema),
	assignees: z.array(userSchema),
	type: ticketTypeSchema,
	project: projectSchema,
	priority: ticketPrioritySchema,
});
