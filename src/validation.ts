import { z } from 'zod';

import {
	REQUIRED_FIELD_ERROR_MESSAGE,
	MEMBERSHIP_ROLE,
	TICKET_PRIORITY_OPTIONS,
	TICKET_TYPE_OPTIONS,
	MEMBERSHIP_STATUS_OPTIONS,
} from '@/constants';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarUrl: z.string(),
});

export const membershipRolesSchema = z.nativeEnum(MEMBERSHIP_ROLE);

export const invitationSchema = z.object({
	email: z.string().email(),
});

export const membershipStatusSchema = z.nativeEnum(MEMBERSHIP_STATUS_OPTIONS);

export const membershipSchema = z.object({
	id: z.string(),
	role: membershipRolesSchema,
	status: membershipStatusSchema,
	invitation: invitationSchema,
});

export const organizationMembershipSchema = membershipSchema.extend({
	user: z.nullable(userSchema),
});

export const organizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	imageUrl: z.string(),
	memberships: z.array(organizationMembershipSchema),
});

export const authUserMembershipSchema = membershipSchema.extend({
	organization: organizationSchema,
});

export const authUserSchema = userSchema.extend({
	memberships: z.array(authUserMembershipSchema),
});

export const authPayloadSchema = z.object({
	token: z.string(),
	user: authUserSchema,
});

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	organization: organizationSchema,
});

const ticketTypeSchema = z.nativeEnum(TICKET_TYPE_OPTIONS);

export const ticketTypeAutocompleteSchema = z.nativeEnum(TICKET_TYPE_OPTIONS, {
	invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE,
});

const ticketPrioritySchema = z.nativeEnum(TICKET_PRIORITY_OPTIONS);

export const ticketPriorityAutocompleteSchema = z.nativeEnum(
	TICKET_PRIORITY_OPTIONS,
	{ invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE }
);

export const ticketAttachmentSchema = z.object({
	name: z.string(),
	id: z.string(),
	size: z.number(),
	type: z.string(),
	fileUrl: z.string(),
});

export const ticketPendingAttachmentSchema = z.object({
	id: z.string(),
	file: typeof File !== 'undefined' ? z.instanceof(File) : z.any(), // `File` doesn't exist during build time so we have to check before creating the schema
});

const ticketBaseSchema = z.object({
	name: z.string(),
	description: z.string(),
	assignees: z.array(organizationMembershipSchema),
	type: ticketTypeSchema,
	project: projectSchema,
	priority: ticketPrioritySchema,
});

export const ticketSchema = ticketBaseSchema.extend({
	id: z.string(),
	attachments: z.array(ticketAttachmentSchema),
});

export const pendingTicketSchema = ticketBaseSchema.extend({
	attachments: z.array(ticketPendingAttachmentSchema),
});
