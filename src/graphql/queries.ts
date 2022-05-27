import { gql } from '@/common/utils/graphqlRequestUtils';
import {
	CORE_AUTH_USER_FIELDS_FRAGMENT,
	CORE_ORGANIZATION_FIELDS_FRAGMENT,
} from '@/graphql/fragments';

export const GET_ORGANIZATION_QUERY = gql`
	query GetOrganization($id: ID!) {
		${CORE_ORGANIZATION_FIELDS_FRAGMENT}
		organization(id: $id) {
			...CoreOrganizationFields
		}
	}
`;

export const GET_PROFILE_QUERY = gql`
	${CORE_AUTH_USER_FIELDS_FRAGMENT}
	query GetProfile {
		profile {
			...CoreAuthUserFields
		}
	}
`;

export const GET_PROJECTS_QUERY = gql`
	query GetProjects($organizationId: ID!) {
		${CORE_ORGANIZATION_FIELDS_FRAGMENT}
		projects(organizationId: $organizationId) {
			id
			name
			description
			organization {
				...CoreOrganizationFields
			}
		}
	}
`;
