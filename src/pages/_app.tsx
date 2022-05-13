import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import createEmotionCache from '@/app/createEmotionCache';
import theme from '@/app/theme';

interface CustomAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

if (process.env.NODE_ENV === 'development') {
	if (typeof window === 'undefined') {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { default: server } = require('../mocks/server');
		server.listen();
	} else {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { default: worker } = require('../mocks/browser');
		worker.start();
	}
}

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

const CustomApp = ({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache,
}: CustomAppProps) => {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
						<ReactQueryDevtools />
					</QueryClientProvider>
				</ThemeProvider>
			</CacheProvider>
		</>
	);
};

export default CustomApp;