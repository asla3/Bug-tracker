import { gql } from '@/common/utils/graphqlRequestUtils';

import { CORE_AUTH_USER_FIELDS_FRAGMENT } from './fragments';

export const LOGIN_MUTATION = gql`
	${CORE_AUTH_USER_FIELDS_FRAGMENT}
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				...CoreAuthUserFields
			}
		}
	}
`;

export const REGISTER_MUTATION = gql`
	${CORE_AUTH_USER_FIELDS_FRAGMENT}
	mutation Register($email: String!, $password: String!) {
		register(email: $email, password: $password) {
			token
			user {
				...CoreAuthUserFields
			}
		}
	}
`;
