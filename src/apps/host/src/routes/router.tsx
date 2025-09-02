import {
  createBrowserRouter,
  type LazyRouteFunction,
  type RouteObject,
} from 'react-router';
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

  const routes: RouteObject[] = manifest.map((m): RouteObject => {
    const base = m.basePath.replace(/\/$/, '');
    const exposed = (m.expose ?? './routes').replace(/^\.?\//, '');
    const id = `${m.name}/${exposed}`;

    const lazy: LazyRouteFunction<RouteObject> = async () => {
      const mod = await loadRemote<RemoteModuleExports>(id);

      const routeModule = (await mod?.createRemoteRouteModule({
        basePath: m.basePath,
        meta: m.meta,
      })) ?? {
        Component: () => <div>Remote mounted but returned nothing.</div>,
      };

      return routeModule;
    };

    return {
      path: `${base}/*`,
      lazy,
    };
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <div>Something went wrong</div>,
      children: routes,
    },
  ]);

  return router;
}
