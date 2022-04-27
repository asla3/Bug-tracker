interface Callback<Params extends any[], ReturnValue = any> {
	(...args: Params): ReturnValue;
}

/**
 * Unifies multiple functions into a single callback.
 */
const callAll =
	<Params extends any[], ReturnValue = any>(
		...fns: (Callback<Params, ReturnValue> | undefined)[]
	) =>
	(...args: Params) =>
		fns.forEach((func) => func?.(...args));

export default callAll;
