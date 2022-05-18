import { gql } from '@/common/utils/graphqlRequestUtils';

export const CORE_USER_FIELDS_FRAGMENT = gql`
	fragment CoreUserFields on User {
		id
		name
		avatarUrl
	}
`;

export const CORE_ORGANIZATION_FIELDS_FRAGMENT = gql`
	${CORE_USER_FIELDS_FRAGMENT}
	fragment CoreOrganizationFields on Organization {
		id
		name
		imageUrl
		members {
			user {
				...CoreUserFields
			}
			role
		}
	}
`;
