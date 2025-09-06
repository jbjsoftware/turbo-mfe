import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { RootProvider } from './providers/root-provider';
import {
  createVirtualRemoteRouteTree,
  type RemoteManifest,
} from './utils/virtual-remote-routes';
import { testAllRemotes } from './utils/test-remote-connection';

// Load remote manifest
async function loadRemoteManifest(): Promise<RemoteManifest[]> {
  try {
    const response = await fetch('/remote-manifest.json');
    return await response.json();
  } catch (error) {
    console.error('Failed to load remote manifest:', error);
    return [];
  }
}

// Render the app with a given router
function renderApp(router: any) {
  const rootElement = document.getElementById('root')!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <RootProvider>
          <RouterProvider router={router} />
        </RootProvider>
      </StrictMode>,
    );
  }
}

// Initialize the app with dynamic routes
async function initializeApp() {
  try {
    // Load remote manifest
    const remoteManifest = await loadRemoteManifest();

    // Test remote connections
    await testAllRemotes(remoteManifest);

    // Create virtual remote route tree with proper mounting
    const dynamicRouteTree = await createVirtualRemoteRouteTree(
      routeTree,
      remoteManifest,
    );

    // Create router with dynamic routes
    const router = createRouter({ routeTree: dynamicRouteTree });

    // Render the app
    renderApp(router);
  } catch (error) {
    console.error('Failed to initialize app with remote routes:', error);

    // Fallback to host-only routes
    const fallbackRouter = createRouter({ routeTree });
    renderApp(fallbackRouter);
  }
}

// Initialize the app
initializeApp();

// Type safety registration (at module level)
declare module '@tanstack/react-router' {
  interface Register {
    router: any; // Use any to avoid version conflicts
  }
}
