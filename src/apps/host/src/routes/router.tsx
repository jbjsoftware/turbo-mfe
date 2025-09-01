import {
  createBrowserRouter,
  type LazyRouteFunction,
  type RouteObject,
} from 'react-router';
import {
  loadRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';

import RootLayout from './root-layout'; // your host shell

type Remote = {
  name: string; // mf scope
  entry: string; // URL to mf-manifest.json
  expose?: string; // default "./routes"
  basePath: string; // e.g. "/dashboard"
  meta?: unknown;
};

type RemoteRouteModule = {
  Component?: React.ComponentType;
  HydrateFallback?: React.ComponentType;
  ErrorBoundary?: React.ComponentType;
  loader?: any;
  action?: any;
  shouldRevalidate?: any;
  headers?: any;
};

type RemoteModuleExports = {
  createRemoteRouteModule: (opts: {
    basePath: string;
    meta?: unknown;
  }) => Promise<RemoteRouteModule>;
};

export async function startRouter() {
  const manifest: Remote[] = await (
    await fetch('/remote-manifest.json')
  ).json();

  await registerRemotes(
    manifest.map((m) => ({ name: m.name, entry: m.entry })),
  );

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
