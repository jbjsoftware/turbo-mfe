import { createBrowserRouter, type RouteObject } from 'react-router';
import {
  loadRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';

import RootLayout from './root-layout';

import type {
  RemoteManifestItem,
  RemoteModuleExports,
} from '@repo/router-types/types';

export async function startRouter() {
  const manifest: RemoteManifestItem[] = await (
    await fetch('/remote-manifest.json')
  ).json();

  registerRemotes(manifest.map((m) => ({ name: m.name, entry: m.entry })));

  // Load all remote routes and merge them into the main router
  const remoteRoutes: RouteObject[] = [];

  for (const m of manifest) {
    const base = m.basePath.replace(/\/$/, '');
    const exposed = (m.expose ?? './app').replace(/^\.?\//, '');
    const id = `${m.name}/${exposed}`;

    try {
      const mod = await loadRemote<RemoteModuleExports>(id);

      if (!mod) {
        console.error(`Remote ${m.name} returned null`);
        continue;
      }

      // Look for route configuration exports
      const routesKey = Object.keys(mod).find(
        (key) =>
          key.includes('routes') || key.includes('Routes') || key === 'default',
      );

      if (!routesKey || !mod[routesKey]) {
        console.error(`No routes found in remote ${m.name}`);
        continue;
      }

      const routes = mod[routesKey];

      if (Array.isArray(routes) && routes.length > 0) {
        // Merge the remote routes under the base path
        const mainRoute = routes[0];
        if (mainRoute && mainRoute.children) {
          // Create a proper nested route structure
          remoteRoutes.push({
            path: base, // Remove the /* wildcard
            element: mainRoute.element,
            errorElement: mainRoute.errorElement,
            loader: mainRoute.loader,
            action: mainRoute.action,
            children: mainRoute.children, // Preserve the nested structure
          });
        }
      }
    } catch (error) {
      console.error(`Failed to load remote ${m.name}:`, error);
      // Add fallback route for failed remote
      remoteRoutes.push({
        path: `${base}/*`,
        element: <div>Failed to load {m.name} remote.</div>,
      });
    }
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <div>Something went wrong</div>,
      children: remoteRoutes,
    },
  ]);

  return router;
}
