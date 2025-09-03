import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import Layout from './layout';

// Import styles for when loaded as remote module
import '@repo/ui/styles/globals.css';

// Lazy load page components
const One = lazy(() => import('../pages/one/one'));
const Two = lazy(() => import('../pages/two/two'));

function ErrorBoundary() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Dashboard Error</h2>
      <p>Something went wrong in the dashboard module.</p>
    </div>
  );
}

// Single source of truth - Data Mode route configuration
// This gets used by both standalone mode AND host integration
export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: One,
        // Data Mode features available everywhere!
        loader: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { message: 'Welcome to Dashboard Home!', timestamp: Date.now() };
        },
      },
      {
        path: 'one',
        Component: One,
        loader: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { message: 'Page One Data', timestamp: Date.now() };
        },
      },
      {
        path: 'two',
        Component: Two,
        loader: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { message: 'Page Two Data', timestamp: Date.now() };
        },
        action: async ({ request }) => {
          const formData = await request.formData();
          const entries: [string, string][] = [];
          formData.forEach((value, key) => {
            entries.push([key, value.toString()]);
          });
          console.log('Form submitted:', entries);
          return { success: true };
        },
      },
    ],
  },
];

// Export for Module Federation - just the routes, not a component
export default dashboardRoutes;
