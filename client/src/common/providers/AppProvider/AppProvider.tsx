import * as React from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import createEmotionCache from '@/app/createEmotionCache';
import theme from '@/app/theme';
import AuthProvider from '@/common/providers/AuthProvider';
import { ErrorBoundary } from '@/modules/error-boundary';
import { getQueryClient } from '@/modules/react-query';
import { Toaster } from '@/modules/toast';

export interface AppProviderProps {
	children: React.ReactNode;
	emotionCache?: EmotionCache;
	dehydratedQueryState?: unknown;
}

const clientSideEmotionCache = createEmotionCache();

const AppProvider = ({
	children,
	emotionCache = clientSideEmotionCache,
	dehydratedQueryState,
}: AppProviderProps) => {
	const [queryClient] = React.useState(getQueryClient);
	return (
		<CacheProvider value={emotionCache}>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={dehydratedQueryState}>
						<ErrorBoundary>
							<Head>
								<meta
									name="viewport"
									content="initial-scale=1, width=device-width"
								/>
							</Head>
							<CssBaseline />
							<AuthProvider>{children}</AuthProvider>
							<Toaster />
						</ErrorBoundary>
						{process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
					</Hydrate>
				</QueryClientProvider>
			</ThemeProvider>
		</CacheProvider>
	);
};

export default AppProvider;
