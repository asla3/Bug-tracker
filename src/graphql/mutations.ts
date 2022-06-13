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
