export interface CompareStringsOptions extends Intl.CollatorOptions {
	locales?: string | string[];
}

const compareStrings = (
	a: string,
	b: string,
	options: CompareStringsOptions = {}
) => {
	const { locales, ...collatorOptions } = options;

	const internalLocales = locales || 'en-US';

	return new Intl.Collator(internalLocales, collatorOptions).compare(a, b);
};

export default compareStrings;
