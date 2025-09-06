import {
  isValidRemoteRouteExport,
  type RemoteRouteExport,
} from '@repo/remote-utils';
import { createRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

export interface RemoteManifest {
  name: string;
  entry: string;
  basePath: string;
  expose: string;
}

/**
 * Creates a virtual mount point for a remote route tree at a specific base path
 * This creates a wrapper route that establishes the correct path context
 */
export async function createVirtualRemoteMount(
  remoteName: string,
  remoteUrl: string,
  basePath: string,
  remoteExpose: string = './routes',
  parentRoute?: any,
): Promise<any> {
  try {
    console.log(`🔧 Creating virtual mount for ${remoteName} at ${basePath}`);

    // Load the remote route tree
    const remoteRouteExport = await loadRemoteRoutes(
      remoteName,
      remoteUrl,
      remoteExpose,
    );

    if (!remoteRouteExport || !remoteRouteExport.routeTree) {
      throw new Error(`No valid route tree found for remote ${remoteName}`);
    }

    // Create a mount route that provides the base path context
    const mountRoute = createRoute({
      getParentRoute: () => parentRoute || (undefined as any),
      path: basePath,
      component: () => {
        // Render the remote's root component within this mount context
        const RemoteComponent = remoteRouteExport.routeTree.options?.component;
        if (RemoteComponent) {
          return React.createElement(RemoteComponent);
        }
        return React.createElement(Outlet);
      },
    });

    // Transform and mount the remote routes as children
    const transformedChildren = await transformRemoteRoutesForMount(
      remoteRouteExport.routeTree,
      mountRoute,
      basePath,
    );

    if (transformedChildren.length > 0) {
      mountRoute.addChildren(transformedChildren);
    }

    return mountRoute;
  } catch (error) {
    console.error(
      `❌ Failed to create virtual mount for ${remoteName}:`,
      error,
    );
    return null;
  }
}

/**
 * Transforms remote routes to work within the mount context
 */
async function transformRemoteRoutesForMount(
  remoteRouteTree: any,
  mountRoute: any,
  basePath: string,
): Promise<any[]> {
  const transformedRoutes: any[] = [];

  // Get children from the remote route tree
  const children = remoteRouteTree._children || remoteRouteTree.children;

  if (!children) {
    console.log(`📝 No children found in remote route tree`);
    return transformedRoutes;
  }

  const childrenArray = Array.isArray(children)
    ? children
    : Object.values(children);

  for (const childRoute of childrenArray) {
    try {
      // Get route information
      const routeId = childRoute.id || childRoute.options?.id;
      const routePath = childRoute.path || childRoute.options?.path;

      console.log(`🔧 Transforming route: ${routeId} with path: ${routePath}`);

      // Create transformed route that works within mount context
      let transformedPath = routePath;

      // Convert absolute paths to relative paths for mounting
      if (routePath && routePath.startsWith('/') && routePath !== '/') {
        transformedPath = routePath.slice(1); // Remove leading slash
      } else if (routePath === '/' || routeId === '/') {
        transformedPath = '/'; // Keep as index route
      }

      const transformedRoute = createRoute({
        getParentRoute: () => mountRoute,
        path: transformedPath,
        component: childRoute.options?.component || childRoute.component,
        loader: childRoute.options?.loader || childRoute.loader,
        beforeLoad: childRoute.options?.beforeLoad || childRoute.beforeLoad,
        errorComponent: childRoute.options?.errorComponent,
        pendingComponent: childRoute.options?.pendingComponent,
        notFoundComponent: childRoute.options?.notFoundComponent,
        validateSearch: childRoute.options?.validateSearch,
      });

      transformedRoutes.push(transformedRoute);
      console.log(`✅ Transformed route ${routeId} -> ${transformedPath}`);
    } catch (error) {
      console.error(`❌ Failed to transform route:`, error);
    }
  }

  return transformedRoutes;
}

/**
 * Dynamically loads a remote module and extracts its route tree
 */
async function loadRemoteRoutes(
  remoteName: string,
  remoteUrl: string,
  remoteExpose: string = './routes',
): Promise<RemoteRouteExport | null> {
  try {
    console.log(`📦 Loading remote routes from ${remoteName}`);

    // Register the remote if not already registered
    const { loadRemote, registerRemotes } = await import(
      '@module-federation/enhanced/runtime'
    );

    await registerRemotes([
      {
        name: remoteName,
        entry: remoteUrl.replace('/mf-manifest.json', '/remoteEntry.js'),
      },
    ]);

    // Load the remote module
    const remoteModule = await loadRemote(
      `${remoteName}/${remoteExpose.replace('./', '')}`,
    );

    if (!remoteModule) {
      throw new Error(
        `Failed to load remote module: ${remoteName}/${remoteExpose}`,
      );
    }

    console.log(`✅ Successfully loaded remote module from ${remoteName}`);

    // Validate the remote export
    if (isValidRemoteRouteExport(remoteModule)) {
      console.log(`✅ Valid route tree found for ${remoteName}`);
      return remoteModule;
    } else {
      console.warn(
        `⚠️ Invalid route export structure from ${remoteName}:`,
        remoteModule,
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ Error loading remote routes from ${remoteName}:`, error);
    return null;
  }
}

/**
 * Creates a dynamic route tree with virtual remote mounts at their base paths
 */
export async function createVirtualRemoteRouteTree(
  hostRouteTree: any,
  remotes: RemoteManifest[],
): Promise<any> {
  console.log(
    `🔧 Creating virtual remote route tree with ${remotes.length} remotes`,
  );

  const virtualRemoteMounts: any[] = [];

  // Create virtual mounts for each remote
  for (const remote of remotes) {
    try {
      const virtualMount = await createVirtualRemoteMount(
        remote.name,
        remote.entry,
        remote.basePath,
        remote.expose,
        hostRouteTree,
      );

      if (virtualMount) {
        virtualRemoteMounts.push(virtualMount);
        console.log(
          `✅ Created virtual mount for ${remote.name} at ${remote.basePath}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ Failed to create virtual mount for ${remote.name}:`,
        error,
      );
    }
  }

  // Add virtual remote mounts to the host route tree
  if (virtualRemoteMounts.length > 0) {
    const existingChildren = hostRouteTree.children || [];
    const allChildren = [...existingChildren, ...virtualRemoteMounts];

    console.log(
      `🎉 Added ${virtualRemoteMounts.length} virtual remote mounts to host`,
    );
    return hostRouteTree.addChildren(allChildren);
  }

  console.log(`⚠️ No virtual remote mounts were created`);
  return hostRouteTree;
}
