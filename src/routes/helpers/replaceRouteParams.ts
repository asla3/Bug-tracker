const replaceRouteParams = (
	url: string,
	paramsReplacements: Record<string, string | undefined>
) => {
	return url.replaceAll(/:([0-9_a-z]+)/gi, (param) => {
		const replacement = paramsReplacements[param];
		if (!replacement) {
			console.warn(
				`Couldn't find a replacement for param \`${param}\`, won't replace.`
			);
			return param;
		}
		return encodeURI(replacement);
	});
};

export default replaceRouteParams;
