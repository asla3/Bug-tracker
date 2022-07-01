/* eslint-disable import/export */

export * from 'react-error-boundary'; // todo 'react-error-boundary' exports a lot of props for their ErrorBoundary. These props are not required, just the ones that were defines by us. We need to find a way to exclude them

export { default as ErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary'; // using a named export instead of `*` because I need to override ErrorBoundaryProps exported by react-error-boundary

export { default as ErrorFallback } from './components/ErrorFallback';
export * from './components/ErrorFallback';
