import { gql } from '@/common/utils/graphqlRequestUtils';

export const CORE_USER_FIELDS_FRAGMENT = gql`
	fragment CoreUserFields on User {
		id
		name
		avatarUrl
	}
`;

export const CORE_MEMBERSHIP_FIELDS_FRAGMENT = gql`
	fragment CoreMembershipFields on Membership {
		id
		role
		status
		invitation {
			email
		}
	}
`;

export const CORE_ORGANIZATION_FIELDS_FRAGMENT = gql`
	${CORE_MEMBERSHIP_FIELDS_FRAGMENT}
	${CORE_USER_FIELDS_FRAGMENT}
	fragment CoreOrganizationFields on Organization {
		id
		name
		imageUrl
		memberships {
			...CoreMembershipFields
			user {
				...CoreUserFields
			}
		}
	}
`;

export const CORE_AUTH_USER_FIELDS_FRAGMENT = gql`
	${CORE_USER_FIELDS_FRAGMENT}
	${CORE_MEMBERSHIP_FIELDS_FRAGMENT}
	${CORE_ORGANIZATION_FIELDS_FRAGMENT}
	fragment CoreAuthUserFields on User {
		...CoreUserFields
		memberships {
			...CoreMembershipFields
			organization {
				...CoreOrganizationFields
			}
		}
	}
`;
