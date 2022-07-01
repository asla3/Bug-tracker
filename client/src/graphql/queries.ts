import { gql } from '@/common/utils/graphqlRequestUtils';

export const GET_ORGANIZATION_QUERY = gql`
	query GetOrganization($id: ID!) {
		organization(id: $id) {
			temp
		}
	}
`;

export const GET_ORGANIZATIONS_QUERY = gql`
	query GetOrganizations {
		organizations {
			temp
		}
	}
`;

export const GET_PROFILE_QUERY = gql`
	query GetProfile {
		profile {
			temp
		}
	}
`;

export const GET_PROJECTS_QUERY = gql`
	query GetProjects($organizationId: ID!) {
		projects(organizationId: $organizationId) {
			temp
		}
	}
`;
