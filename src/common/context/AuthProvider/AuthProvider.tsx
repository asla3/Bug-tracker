import { initReactQueryAuth } from 'react-query-auth';

import Loader from '@/common/components/Loader';
import {
	getAuthToken,
	removeStoredAuthToken,
	getProfile,
	loginWithEmailAndPassword,
	registerWithEmailAndPassword,
	LoginCredentials,
	RegisterCredentials,
} from '@/common/utils/auth';
import { LOGIN } from '@/routes';
import type { User } from '@/types/api';

const loadUser = async () => {
	const token = getAuthToken();

	if (!token) return null;

	const userProfile = await getProfile();
	return userProfile;
};

const logoutFn = async () => {
	removeStoredAuthToken();
	window.location.assign(LOGIN);
};

const authConfig = {
	loadUser,
	loginFn: loginWithEmailAndPassword,
	registerFn: registerWithEmailAndPassword,
	logoutFn,
	LoaderComponent: Loader,
};

const { AuthProvider, useAuth } = initReactQueryAuth<
	User | null,
	unknown,
	LoginCredentials,
	RegisterCredentials
>(authConfig);

export { useAuth };
export default AuthProvider;
