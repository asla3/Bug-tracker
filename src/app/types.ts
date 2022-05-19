import type { EmotionCache } from '@emotion/react';
import type { AppProps as NextAppProps } from 'next/app';

export interface AppProps extends NextAppProps {
	emotionCache?: EmotionCache;
	err?: Error;
}
