/*
	For now types are just dummies just so we don't have a bunch of `any`s throughout the whole app. They are subject to changes as I finish the frontend, and start working on the backend and the structure of the data.
*/

export interface Organization {
	id: string;
	name: string;
	imageUrl: string;
}

export interface Project {
	name: string;
	id: string;
	description: string;
	organization: Organization;
}
