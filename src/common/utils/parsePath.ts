// copied from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-link/src/parse-path.js
const parsePath = (path: string) => {
	let pathname = path || '/';
	let search = '';
	let hash = '';

	const searchIndex = pathname.indexOf('?');
	if (searchIndex !== -1) {
		search = pathname.slice(searchIndex);
		pathname = pathname.slice(0, searchIndex);
	}

	const hashIndex = pathname.indexOf('#');
	if (hashIndex !== -1) {
		hash = pathname.slice(hashIndex);
		pathname = pathname.slice(0, hashIndex);
	}

	return {
		pathname,
		search: search === '?' ? '' : search,
		hash: hash === '#' ? '' : hash,
	};
};

export default parsePath;
