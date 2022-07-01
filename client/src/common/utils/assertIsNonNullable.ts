export interface AssertIsNonNullableConfig {
	message?: string;
	onError?: (error: Error) => void;
}

// careful with changing implementation of this function, typescript does not type check that it actually asserts non-nullish values.
function assertIsNonNullable<T>(
	value: T,
	options?: AssertIsNonNullableConfig
): asserts value is NonNullable<T> {
	if (value == undefined) {
		const message =
			options?.message ||
			`Expected value to be non-nullable, got ${value} instead.`;

		const error = new Error(message);

		options?.onError?.(error);

		throw error;
	}
}

export default assertIsNonNullable;
