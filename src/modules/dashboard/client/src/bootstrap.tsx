import React from 'react';
import { createRoot } from 'react-dom/client';
import { UIProvider } from '@repo/ui/providers/ui-provider';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { dashboardRoutes } from './routes/routes.tsx';

const standaloneRouter = createBrowserRouter(dashboardRoutes);

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <UIProvider>
      <RouterProvider router={standaloneRouter} />
    </UIProvider>
  </React.StrictMode>,
);
