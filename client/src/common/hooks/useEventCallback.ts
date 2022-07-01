import * as React from 'react';

type Callback<TArgs extends unknown[], TReturnValue> = (
	...args: TArgs
) => TReturnValue;

const useEventCallback = <TArgs extends unknown[], TReturnValue>(
	callback: Callback<TArgs, TReturnValue>
): Callback<TArgs, TReturnValue> => {
	const callbackRef = React.useRef<Callback<TArgs, TReturnValue> | null>(null);

	React.useLayoutEffect(() => {
		callbackRef.current = callback;
	});

	return React.useCallback((...args: TArgs) => {
		const callback = callbackRef.current;
		if (!callback) {
			throw new Error("Callback shouldn't be called during render");
		}
		return callback(...args);
	}, []);
};

export default useEventCallback;
