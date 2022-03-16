import createCache from '@emotion/cache';

// `prepend` moves MUI styled to the top of the page, allowing for easily overridable MUI styles
const createEmotionCache = () => {
	return createCache({ key: 'css', prepend: true });
};

export default createEmotionCache;
