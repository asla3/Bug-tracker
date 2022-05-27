import {
	getProfile,
	loginWithEmailAndPassword,
	registerWithEmailAndPassword,
	LoginCredentials,
	RegisterCredentials,
} from '@/api';
import {
	removeStoredAuthToken,
	getAuthToken,
	storeAuthToken,
} from '@/common/utils/authToken';
import { LOGIN } from '@/routes';

export const loadUser = async () => {
	const token = getAuthToken();

	if (!token) return null;

	const userProfile = await getProfile();
	return userProfile;
};

export const loginUser = async (credentials: LoginCredentials) => {
	const { token, user } = await loginWithEmailAndPassword(credentials);
	storeAuthToken(token);
	return user;
};

export const registerUser = async (credentials: RegisterCredentials) => {
	const { token, user } = await registerWithEmailAndPassword(credentials);
	storeAuthToken(token);
	return user;
};

export const logoutUser = async () => {
	removeStoredAuthToken();
	window.location.assign(LOGIN);
};
