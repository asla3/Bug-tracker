import { gql } from '@/common/utils/graphqlRequestUtils';

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			temp
		}
	}
`;

export const REGISTER_MUTATION = gql`
	mutation Register($email: String!, $password: String!) {
		register(email: $email, password: $password) {
			temp
		}
	}
`;

export const CREATE_TICKET_MUTATION = gql`
	mutation CreateTicket(
		$project: ProjectInput
		$name: String!
		$assignees: AssigneeInput
		$type: String!
		$priority: String!
		$attachments: [AttachmentInput]
	) {
		createTicket(
			project: $project
			name: $name
			assignees: $assignees
			type: $type
			priority: $priority
			attachments: $attachments
		) {
			temp
		}
	}
`;
