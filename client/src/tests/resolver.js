// thanks @microsoft https://github.com/microsoft/accessibility-insights-web/pull/5421/commits/9ad4e618019298d82732d49d00aafb846fb6bac7

// List of packages that we need to resolve to their node versions because they use ESM modules for the browser.
// jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
// but some packages only offer an ESM browser export and not a CommonJS one. Jest does not yet
// support ESM modules natively, so this causes a Jest error related to trying to parse
// "export" syntax, which is why we need to resolve them to their node versions.
const packagesToResolveToNode = ['nanoid', '@hookform/resolvers'];

module.exports = (path, options) => {
	// Call the defaultResolver, so we leverage its cache, error handling, etc.
	return options.defaultResolver(path, {
		...options,
		// Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
		packageFilter: (pkg) => {
			// Here we prevent Jest from considering module-based exports at all for the packages inside the `esmBrowserPackages` array;
			// it falls back to their CommonJS+node "main" property.
			// Once we're able to migrate our Jest config to ESM and a browser crypto
			// implementation is available for the browser+ESM version of nanoid to use (eg, via
			// https://github.com/jsdom/jsdom/pull/3352 or a similar polyfill), this can go away.
			if (packagesToResolveToNode.includes(pkg.name)) {
				delete pkg['exports'];
				delete pkg['module'];
			}
			return pkg;
		},
	});
};
