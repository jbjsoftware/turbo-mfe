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
 * Dynamically loads a remote module and extracts its route tree
 */
export async function loadRemoteRoutes(
  remoteName: string,
  remoteUrl: string,
  exposedModule: string = './routes',
): Promise<any | null> {
  try {
    // Load the remote module using Module Federation
    const remoteModule = await loadRemoteModule(
      remoteName,
      remoteUrl,
      exposedModule,
    );

    // Validate the remote module export
    if (
      !remoteModule ||
      (!remoteModule.routeTree && !isValidRemoteRouteExport(remoteModule))
    ) {
      console.warn(
        `Remote ${remoteName} does not export a valid route structure`,
      );
      console.log('Remote module structure:', remoteModule);
      return null;
    }

    const routeTree = remoteModule.routeTree;
    console.log(`✅ Successfully loaded route tree for ${remoteName}`);

    // Return as any to avoid version compatibility issues
    return routeTree as any;
  } catch (error) {
    console.error(`Failed to load remote routes from ${remoteName}:`, error);
    return null;
  }
}

/**
 * Loads all remote routes from the manifest and returns them as an array
 */
export async function loadAllRemoteRoutes(
  manifest: RemoteManifest[],
): Promise<Array<{ name: string; routeTree: any; basePath: string }>> {
  const remoteRoutes = await Promise.allSettled(
    manifest.map(async (remote) => {
      const routeTree = await loadRemoteRoutes(
        remote.name,
        remote.entry,
        remote.expose,
      );
      return routeTree
        ? { name: remote.name, routeTree, basePath: remote.basePath }
        : null;
    }),
  );

  return remoteRoutes
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        name: string;
        routeTree: any;
        basePath: string;
      }> => result.status === 'fulfilled' && result.value !== null,
    )
    .map((result) => result.value);
}

/**
 * Dynamically loads a remote module using Module Federation Enhanced
 */
async function loadRemoteModule(
  remoteName: string,
  remoteUrl: string,
  exposedModule: string,
): Promise<RemoteRouteExport | null> {
  try {
    console.log(
      `Attempting to load remote module: ${remoteName} from ${remoteUrl}`,
    );

    // Try the enhanced runtime approach first
    try {
      const { loadRemote, registerRemotes } = await import(
        '@module-federation/enhanced/runtime'
      );

      // Convert mf-manifest.json URL to remoteEntry.js URL if needed
      let entryUrl = remoteUrl;
      if (remoteUrl.includes('mf-manifest.json')) {
        entryUrl = remoteUrl.replace('mf-manifest.json', 'remoteEntry.js');
      }

      console.log(`Registering remote ${remoteName} with entry: ${entryUrl}`);

      // Register the remote
      registerRemotes([
        {
          name: remoteName,
          entry: entryUrl,
        },
      ]);

      // Small delay to ensure registration is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log(
        `Loading module: ${remoteName}/${exposedModule.replace('./', '')}`,
      );

      // Load the exposed module - use the correct format
      const module = await loadRemote(
        `${remoteName}/${exposedModule.replace('./', '')}`,
      );

      console.log(`✅ Successfully loaded module from ${remoteName}`);

      return module as RemoteRouteExport;
    } catch (enhancedError) {
      console.warn(
        `Enhanced runtime failed, trying manual approach:`,
        enhancedError,
      );

      // Fallback to manual loading
      return await loadRemoteManually(remoteName, remoteUrl, exposedModule);
    }
  } catch (error) {
    console.error(`Error loading remote module ${remoteName}:`, error);
    return null;
  }
}

/**
 * Fallback method to load remote manually using script injection
 */
async function loadRemoteManually(
  remoteName: string,
  remoteUrl: string,
  exposedModule: string,
): Promise<RemoteRouteExport | null> {
  try {
    // Convert mf-manifest.json URL to remoteEntry.js URL if needed
    let entryUrl = remoteUrl;
    if (remoteUrl.includes('mf-manifest.json')) {
      entryUrl = remoteUrl.replace('mf-manifest.json', 'remoteEntry.js');
    }

    console.log(`Manually loading remote from: ${entryUrl}`);

    // First, check if the remote is accessible
    try {
      const response = await fetch(entryUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(
          `Remote entry not accessible: ${response.status} ${response.statusText}`,
        );
      }
      console.log(`Remote entry is accessible at: ${entryUrl}`);
    } catch (fetchError) {
      console.error(`Remote entry not accessible:`, fetchError);
      throw fetchError;
    }

    // Load the remote script
    await loadScript(entryUrl);

    // Wait a bit for the script to execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get the remote container from window
    console.log(`Looking for remote container: ${remoteName}`);
    console.log(
      'Available containers on window:',
      Object.keys(window).filter(
        (key) =>
          key !== 'window' &&
          key !== 'self' &&
          key !== 'top' &&
          key !== 'parent',
      ),
    );

    const container = (window as any)[remoteName];
    if (!container) {
      throw new Error(
        `Remote container ${remoteName} not found on window. Available: ${Object.keys(window).filter((key) => typeof (window as any)[key] === 'object' && (window as any)[key]?.get)}`,
      );
    }

    console.log(`Found remote container:`, container);

    // Initialize the container with shared dependencies
    const sharedScope = (window as any).__webpack_share__ || {};
    console.log(
      `Initializing container with shared scope:`,
      Object.keys(sharedScope),
    );

    await container.init(sharedScope);

    // Get the factory for the exposed module
    const moduleKey = exposedModule.startsWith('./')
      ? exposedModule.slice(2)
      : exposedModule;
    console.log(`Getting module factory for: ${moduleKey}`);
    console.log(`Available modules in container:`, container);

    const factory = await container.get(moduleKey);
    console.log(`Got factory:`, factory);

    const module = factory();
    console.log(
      `Successfully loaded module manually from ${remoteName}:`,
      module,
    );

    console.log(`✅ Manual loading successful for ${remoteName}`);

    return module as RemoteRouteExport;
  } catch (error) {
    console.error(`Manual loading failed for ${remoteName}:`, error);
    return null;
  }
}

/**
 * Loads a script dynamically
 */
function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    document.head.appendChild(script);
  });
}

/**
 * Creates a route tree with dynamically loaded remote routes
 */
export function createDynamicRouteTree(
  hostRouteTree: any,
  remoteRoutes: Array<{ name: string; routeTree: any; basePath: string }>,
): any {
  console.log(
    `🔧 Creating dynamic route tree with ${remoteRoutes.length} remote routes`,
  );

  // Get existing children from host route tree
  const hostChildren = hostRouteTree._children || hostRouteTree.children || {};

  // Create new children object that includes both host and remote routes
  // Use the host children we found, handling both object and array formats
  let newChildren: any = {};

  if (Array.isArray(hostChildren)) {
    // If host children is an array, convert to object format
    hostChildren.forEach((child: any, index: number) => {
      const key = child.id || child.options?.id || `host-child-${index}`;
      newChildren[key] = child;
    });
  } else {
    newChildren = { ...hostChildren };
  }

  // Add remote routes to the route tree
  remoteRoutes.forEach(({ routeTree, basePath, name }) => {
    try {
      console.log(`📦 Adding remote route ${name} at ${basePath}`);

      // Create a wrapper route for the remote with the basePath
      const wrappedRemoteRoute = wrapRemoteRoute(routeTree, basePath, name);

      // Set the parent route for the wrapped route
      wrappedRemoteRoute.update({
        getParentRoute: () => hostRouteTree,
      });

      // Add to the new children with a unique key
      newChildren[`remote-${name}`] = wrappedRemoteRoute;

      console.log(`✅ Successfully added remote route ${name}`);
    } catch (error) {
      console.error(`❌ Failed to integrate remote route ${name}:`, error);
    }
  });

  // Create a new route tree with the combined children
  const dynamicRouteTree = hostRouteTree._addFileChildren(newChildren);

  console.log(
    `🎉 Created dynamic route tree with ${Object.keys(newChildren).length} total routes`,
  );
  return dynamicRouteTree;
}

/**
 * Wraps a remote route tree to mount it at a specific base path
 */
function wrapRemoteRoute(
  remoteRouteTree: any,
  basePath: string,
  remoteName: string,
): any {
  console.log(`🎁 Wrapping remote route tree for ${remoteName} at ${basePath}`);

  // Use the remote's root route as the wrapper, but change its path
  const remoteLayoutComponent = remoteRouteTree.options?.component;

  const wrapperRoute = createRoute({
    getParentRoute: () => undefined as any, // Will be set when added to host tree
    path: basePath,
    // Use the remote's root component directly
    component: remoteLayoutComponent,
    // Copy other options from the remote root route
    loader: remoteRouteTree.options?.loader,
    beforeLoad: remoteRouteTree.options?.beforeLoad,
    errorComponent: remoteRouteTree.options?.errorComponent,
    pendingComponent: remoteRouteTree.options?.pendingComponent,
    notFoundComponent: remoteRouteTree.options?.notFoundComponent,
    validateSearch: remoteRouteTree.options?.validateSearch,
  });

  // Check for children in different possible locations
  const children = remoteRouteTree._children || remoteRouteTree.children;

  // If the remote route tree has children, we need to remap them
  if (
    children &&
    (Array.isArray(children)
      ? children.length > 0
      : Object.keys(children).length > 0)
  ) {
    const remappedChildren: any = {};

    if (Array.isArray(children)) {
      // Handle array format (TanStack Router children property)
      children.forEach((childRoute: any, index: number) => {
        // Try to get route info from different places
        const routeId =
          childRoute.id ||
          childRoute.options?.id ||
          childRoute.options?.path ||
          `child-${index}`;
        let routePath = childRoute.path || childRoute.options?.path || '/';

        // For remote routes, convert absolute paths to relative paths for proper nesting
        // e.g., '/foo' becomes 'foo' when mounted under '/dashboard'
        if (routePath.startsWith('/') && routePath !== '/') {
          routePath = routePath.slice(1);
        }

        // Special handling for root route (/) - make it the index route of the wrapper
        if (routePath === '/' || routeId === '/') {
          // Create an index route that renders the dashboard's root component
          const indexRoute = createRoute({
            getParentRoute: () => wrapperRoute,
            path: '/', // Index route path
            component: childRoute.options?.component || childRoute.component,
            loader: childRoute.options?.loader || childRoute.loader,
            beforeLoad: childRoute.options?.beforeLoad || childRoute.beforeLoad,
            errorComponent: childRoute.options?.errorComponent,
            pendingComponent: childRoute.options?.pendingComponent,
            notFoundComponent: childRoute.options?.notFoundComponent,
            validateSearch: childRoute.options?.validateSearch,
            // Note: Explicitly NOT copying id, path, or getParentRoute from options
          });

          remappedChildren['index'] = indexRoute;
        } else {
          // For non-root routes, create them as child routes with proper path context
          const wrappedChildRoute = createRoute({
            getParentRoute: () => wrapperRoute,
            path: routePath,
            component: childRoute.options?.component || childRoute.component,
            loader: childRoute.options?.loader || childRoute.loader,
            beforeLoad: childRoute.options?.beforeLoad || childRoute.beforeLoad,
            errorComponent: childRoute.options?.errorComponent,
            pendingComponent: childRoute.options?.pendingComponent,
            notFoundComponent: childRoute.options?.notFoundComponent,
            validateSearch: childRoute.options?.validateSearch,
            // Note: Explicitly NOT copying id, path, or getParentRoute from options
          });

          // Use the path as the key, removing leading slash for cleaner keys
          const childKey = routePath.startsWith('/')
            ? routePath.slice(1)
            : routePath;
          remappedChildren[childKey || `child-${index}`] = wrappedChildRoute;
        }
      });
    } else {
      // Handle object format (traditional _children)
      Object.keys(children).forEach((key) => {
        const childRoute = children[key];
        console.log(`Processing child route: ${key}`, childRoute);
        console.log('Child route details:', {
          id: childRoute.id,
          path: childRoute.path,
          fullPath: childRoute.fullPath,
        });

        // Create a new route that inherits from the child but with updated parent
        const wrappedChildRoute = createRoute({
          getParentRoute: () => wrapperRoute,
          path: childRoute.path,
          component: childRoute.options?.component || childRoute.component,
          loader: childRoute.options?.loader || childRoute.loader,
          beforeLoad: childRoute.options?.beforeLoad || childRoute.beforeLoad,
          errorComponent: childRoute.options?.errorComponent,
          pendingComponent: childRoute.options?.pendingComponent,
          notFoundComponent: childRoute.options?.notFoundComponent,
          validateSearch: childRoute.options?.validateSearch,
          // Note: Explicitly NOT copying id, path, or getParentRoute from options
        });

        remappedChildren[key] = wrappedChildRoute;
      });
    }

    // Add the remapped children to the wrapper route
    wrapperRoute.addChildren(Object.values(remappedChildren));
  } else {
    console.log(
      'No children found in remote route tree, creating a simple wrapper',
    );

    // If there are no children, try to render the remote route tree itself as the index
    // This handles the case where the remote exports a complete route tree without _children
    let indexComponent;

    // Try to get the component from various possible locations
    if (remoteRouteTree.options?.component) {
      indexComponent = remoteRouteTree.options.component;
    } else if (typeof remoteRouteTree.component === 'function') {
      indexComponent = remoteRouteTree.component;
    } else {
      // Fallback: create a simple component that shows the remote is loaded
      indexComponent = () => {
        return React.createElement(
          'div',
          null,
          `Remote ${remoteName} loaded successfully`,
        );
      };
    }

    const indexRoute = createRoute({
      getParentRoute: () => wrapperRoute,
      path: '/',
      component: indexComponent,
    });

    wrapperRoute.addChildren([indexRoute]);
  }

  console.log('Wrapped route tree:', wrapperRoute);
  return wrapperRoute;
}
