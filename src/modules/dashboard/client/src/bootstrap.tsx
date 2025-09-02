import React from 'react';
import { createRoot } from 'react-dom/client';
import { UIProvider } from '@repo/ui/providers/ui-provider';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { createRemoteRouteModule } from './routes/route-definitions';

// Re-export for Module Federation
export { createRemoteRouteModule } from './routes/route-definitions';

// Bootstrap the standalone dashboard app
(async () => {
  const root = createRoot(document.getElementById('root')!);

  try {
    // Create the dashboard route module
    const dashboardModule = await createRemoteRouteModule({
      basePath: '/',
      meta: { title: 'Dashboard', requiresAuth: false },
    });

    // Create router with the dashboard routes
    const router = createBrowserRouter([
      {
        path: '/*',
        element: dashboardModule.Component ? <dashboardModule.Component params={{}} /> : null,
        errorElement: dashboardModule.ErrorBoundary ? (
          <dashboardModule.ErrorBoundary />
        ) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h2>Dashboard Error</h2>
            <p>Something went wrong in the dashboard module.</p>
          </div>
        ),
      },
    ]);

    root.render(
      <React.StrictMode>
        <UIProvider>
          <RouterProvider router={router} />
        </UIProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to start dashboard app:', error);
    root.render(
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>Startup Error</h2>
        <p>Failed to start the dashboard application.</p>
        <details style={{ marginTop: 16, textAlign: 'left' }}>
          <summary>Error Details</summary>
          <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{error instanceof Error ? error.message : String(error)}</pre>
        </details>
      </div>,
    );
  }
})();
