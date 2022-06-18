import * as React from 'react';

import useEventCallback from './useEventCallback';

export interface UseStoppableEffectCallback {
	(stopRunningEffect: () => void): ReturnType<React.EffectCallback>;
}

/**
 * Passes a function to the effect callback that, when called, will prevent the effect from running during the next renders.
 */
const useStoppableEffect = (
	callback: UseStoppableEffectCallback,
	dependencies: React.DependencyList = []
) => {
	const effectStoppedRef = React.useRef(false);

	const stableCallback = useEventCallback(callback);

	const stopRunningEffect = React.useCallback(() => {
		effectStoppedRef.current = true;
	}, []);

	React.useEffect(() => {
		if (effectStoppedRef.current) return;

		const effectCallbackResult = stableCallback(stopRunningEffect);

		return effectCallbackResult;
	}, [stopRunningEffect, stableCallback, ...dependencies]);
};

export default useStoppableEffect;
