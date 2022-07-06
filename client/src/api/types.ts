import type {
	MEMBERSHIP_ROLE,
	TICKET_PRIORITY_OPTIONS,
	TICKET_TYPE_OPTIONS,
	MEMBERSHIP_STATUS_OPTIONS,
} from '@/constants';

import type { GetKeysValue } from '../types/utils';

/*
	For now types are just dummies just so we don't have a bunch of `any`s throughout the whole app. They are subject to changes as I finish the frontend.
*/

export interface AuthPayload {
	token: string;
	user: AuthUser;
}

export interface User {
	name: string;
	avatarUrl: string;
	id: string;
	email: string;
}

// contains private data that should just be accesible to the current signed-in user
export interface AuthUser extends User {
	//todo keeping this because we might want to extend the user model to include private data that will be available only to the logged in user
}

export interface Membership {
	id: string;
	role: MembershipRole;
	status: MembershipStatus;
	invitation: Invitation;
	user: User | null;
}

export type MembershipRole = GetKeysValue<typeof MEMBERSHIP_ROLE>;

export type MembershipStatus = GetKeysValue<typeof MEMBERSHIP_STATUS_OPTIONS>;

export interface Invitation {
	id: string;
	email: string;
}

export interface Organization {
	id: string;
	name: string;
	imageUrl: string;
	memberships: Membership[];
}

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
	fileUrl: string;
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
	assignees: Membership[];
	type: TicketType;
	project: Project;
	priority: TicketPriority;
}

export interface PendingTicket extends Omit<Ticket, 'attachments' | 'id'> {
	attachments: TicketPendingAttachment[];
}
