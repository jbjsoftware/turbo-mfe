import { lazy, Suspense } from 'react';
import Layout from './layout';
import { useRoutes } from 'react-router';

// Lazy load page components with proper module federation handling
const One = lazy(async () => {
  const module = await import('@/pages/one/one');
  return { default: module.default };
});

const Two = lazy(async () => {
  const module = await import('@/pages/two/two');
  return { default: module.default };
});

function RemoteErrorBoundary() {
  return <div>Dashboard crashed.</div>;
}

export async function createRemoteRouteModule(_opts?: {
  basePath?: string;
  meta?: any;
}) {
  function RemoteDashboardModule() {
    const element = useRoutes([
      {
        path: '/',
        element: <Layout />,
        ErrorBoundary: RemoteErrorBoundary,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <One />
              </Suspense>
            ),
          }, // Default route for /dashboard
          {
            path: 'one',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <One />
              </Suspense>
            ),
          },
          {
            path: 'two',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
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
}
