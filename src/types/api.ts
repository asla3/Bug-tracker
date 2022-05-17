import type {
	ORGANIZATION_MEMBER_ROLE_OPTIONS,
	TICKET_PRIORITY_OPTIONS,
	TICKET_TYPE_OPTIONS,
} from '@/constants';

import type { GetKeysValue } from './utils';

/*
	For now types are just dummies just so we don't have a bunch of `any`s throughout the whole app. They are subject to changes as I finish the frontend.
*/

export interface User {
	name: string;
	avatarUrl: string;
	id: string;
}

export interface Organization {
	id: string;
	name: string;
	imageUrl: string;
	members: OrganizationMember[];
}

export interface OrganizationMember {
	user: User;
	role: OrganizationMemberRole;
}

export type OrganizationMemberRole = GetKeysValue<
	typeof ORGANIZATION_MEMBER_ROLE_OPTIONS
>;

export interface Project {
	name: string;
	id: string;
	description: string;
	organization: Organization;
}

export interface TicketAttachment {
	name: string;
	id: string;
	size: number;
	type: string;
}

export interface TicketPendingAttachment {
	file: File;
	id: string;
}

export type TicketType = GetKeysValue<typeof TICKET_TYPE_OPTIONS>;

export type TicketPriority = GetKeysValue<typeof TICKET_PRIORITY_OPTIONS>;

export interface Ticket {
	id: string;
	name: string;
	description: string;
	attachments: TicketAttachment[];
	assignees: User[];
	type: TicketType;
	project: Project;
	priority: TicketPriority;
}

export interface PendingTicket extends Omit<Ticket, 'attachments' | 'id'> {
	attachments: TicketPendingAttachment[];
}
