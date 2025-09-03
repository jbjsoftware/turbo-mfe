# Remote App Template

This template shows how to create a simple, maintainable remote app that can be easily integrated into the host.

## 1. Bootstrap file (`src/bootstrap.tsx`)

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { UIProvider } from '@repo/ui/providers/ui-provider';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { yourAppRoutes } from './routes/your-app';

// For standalone mode, create router with our Data Mode routes
const standaloneRouter = createBrowserRouter(yourAppRoutes);

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <UIProvider>
      <RouterProvider router={standaloneRouter} />
    </UIProvider>
  </React.StrictMode>,
);
```

## 2. App routes (`src/routes/your-app.tsx`)

```tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import Layout from './layout';

// Lazy load your page components
const PageOne = lazy(() => import('../pages/page-one'));
const PageTwo = lazy(() => import('../pages/page-two'));

function ErrorBoundary() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Your App Error</h2>
      <p>Something went wrong in your module.</p>
    </div>
  );
}

// Single source of truth - Data Mode route configuration
// This gets used by both standalone mode AND host integration
export const yourAppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: PageOne,
        // Data Mode features available everywhere!
        loader: async () => {
          const data = await fetch('/api/page-one').then((r) => r.json());
          return { data, timestamp: Date.now() };
        },
      },
      {
        path: 'page-one',
        Component: PageOne,
        loader: async () => {
          const data = await fetch('/api/page-one').then((r) => r.json());
          return { data, timestamp: Date.now() };
        },
      },
      {
        path: 'page-two',
        Component: PageTwo,
        loader: async () => {
          const data = await fetch('/api/page-two').then((r) => r.json());
          return { data, timestamp: Date.now() };
        },
        action: async ({ request }) => {
          const formData = await request.formData();
          const response = await fetch('/api/page-two', {
            method: 'POST',
            body: formData,
          });
          return response.json();
        },
      },
    ],
  },
];

// Export for Module Federation - just the routes
export default yourAppRoutes;
```

## 3. Module Federation config

```ts
export default createModuleFederationConfig({
  name: 'your-remote-name',
  filename: 'remoteEntry.js',
  exposes: {
    './app': './src/routes/routes.tsx', // Expose the app component directly
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router': { singleton: true },
    '@repo/router-types': { singleton: true },
  },
});
```

## 4. Add to host manifest

```json
{
  "name": "your-remote-name",
  "entry": "http://localhost:YOUR_PORT/mf-manifest.json",
  "basePath": "/your-route-path",
  "expose": "./app"
}
```

## That's it!

This pattern is:

- ✅ **Single Source of Truth** - one route definition for both modes
- ✅ **Full Data Mode** - loaders, actions, and automatic revalidation everywhere
- ✅ **Direct Route Merging** - host merges remote routes into its router
- ✅ Simple and maintainable
- ✅ Easy to reproduce for new remotes
- ✅ No complex async factories or lazy loading
- ✅ Clear separation of concerns
- ✅ Better error handling with route-level error boundaries
- ✅ Type-safe with shared router types
- ✅ Same features in both standalone and integrated modes
