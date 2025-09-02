import { lazy, Suspense } from 'react';
import Layout from './layout';
import { useRoutes } from 'react-router';

import type { CreateRemoteRoute } from '@repo/router-types/contracts';
import type { BaseRouteParams } from '@repo/router-types/types';

// Define your specific route params
interface DashboardParams extends BaseRouteParams {
  id?: string;
}

// Lazy load page components with proper module federation handling
const One = lazy(async () => {
  const module = await import('../pages/one/one');
  return { default: module.default };
});

const Two = lazy(async () => {
  const module = await import('../pages/two/two');
  return { default: module.default };
});

function RemoteErrorBoundary() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Dashboard Error</h2>
      <p>Something went wrong in the dashboard module.</p>
    </div>
  );
}

// Type-safe remote route factory implementation
export const createRemoteRouteModule: CreateRemoteRoute<DashboardParams> = async (opts) => {
  // Use opts for potential future configuration
  const { basePath = '/', meta } = opts;

  function RemoteDashboardModule({ params = {} }: { params?: DashboardParams }) {
    // Log route params for debugging (can be used for route-specific logic)
    console.debug('Dashboard route params:', params);
    console.debug('Dashboard base path:', basePath);
    console.debug('Dashboard meta:', meta);

    const element = useRoutes([
      {
        path: '/',
        element: <Layout />,
        ErrorBoundary: RemoteErrorBoundary,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading Dashboard...</div>}>
                <One />
              </Suspense>
            ),
          },
          {
            path: 'one',
            element: (
              <Suspense fallback={<div>Loading Page One...</div>}>
                <One />
              </Suspense>
            ),
          },
          {
            path: 'two',
            element: (
              <Suspense fallback={<div>Loading Page Two...</div>}>
                <Two />
              </Suspense>
            ),
          },
        ],
      },
    ]);

    return element;
  }

  return {
    Component: RemoteDashboardModule,
    ErrorBoundary: RemoteErrorBoundary,
  };
};
