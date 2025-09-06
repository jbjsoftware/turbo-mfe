# Example: Creating a New Remote with Dynamic Routes

This example shows how to create a new remote application that can be dynamically loaded by the host.

## Step 1: Create Remote Application Structure

```
src/modules/profile/client/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── settings.tsx
│   ├── remote-routes.tsx
│   ├── bootstrap.tsx
│   └── index.tsx
├── module-federation.config.ts
├── rsbuild.config.ts
└── package.json
```

## Step 2: Create Route Files

### `src/routes/__root.tsx`

```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="profile-app">
      <h2>Profile Module</h2>
      <Outlet />
    </div>
  ),
});
```

### `src/routes/index.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: ProfileHome,
});

function ProfileHome() {
  return (
    <div>
      <h3>Profile Home</h3>
      <p>Welcome to your profile!</p>
    </div>
  );
}
```

### `src/routes/settings.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: ProfileSettings,
});

function ProfileSettings() {
  return (
    <div>
      <h3>Profile Settings</h3>
      <p>Manage your profile settings here.</p>
    </div>
  );
}
```

## Step 3: Create Remote Route Export

### `src/remote-routes.tsx`

```typescript
import { routeTree } from "./routeTree.gen";

// Export the route tree for the host to consume
export { routeTree };

// Optional: Export additional metadata about the remote
export const remoteInfo = {
  name: "profile",
  version: "1.0.0",
  basePath: "/profile",
  description: "User profile management routes",
};

// Default export for convenience
export default {
  routeTree,
  ...remoteInfo,
};
```

## Step 4: Configure Module Federation

### `module-federation.config.ts`

```typescript
import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";

export default createModuleFederationConfig({
  name: "profile",
  exposes: {
    "./routes": "./src/remote-routes",
  },
  filename: "remoteEntry.js",
  dts: {
    generateTypes: process.env.NODE_ENV === "production",
    consumeTypes: true,
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@tanstack/react-router": { singleton: true },
    "@repo/ui": { singleton: true },
  },
});
```

## Step 5: Create Bootstrap File

### `src/bootstrap.tsx`

```typescript
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { UIProvider } from '@repo/ui/providers/ui-provider';

// Create router for standalone mode
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app (for standalone development)
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </StrictMode>,
  );
}
```

## Step 6: Configure Rsbuild

### `rsbuild.config.ts`

```typescript
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";

import moduleFederationConfig from "./module-federation.config";

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
        }),
      ],
    },
  },
  server: {
    port: 3003, // Choose an available port
  },
  dev: {
    assetPrefix: "http://localhost:3003",
  },
});
```

## Step 7: Update Host Manifest

Add the new remote to the host's `public/remote-manifest.json`:

```json
[
  {
    "name": "dashboard",
    "entry": "http://localhost:3001/mf-manifest.json",
    "basePath": "/dashboard",
    "expose": "./routes"
  },
  {
    "name": "profile",
    "entry": "http://localhost:3003/mf-manifest.json",
    "basePath": "/profile",
    "expose": "./routes"
  }
]
```

## Step 8: Add Package Scripts

### `package.json`

```json
{
  "name": "@repo/profile-client",
  "scripts": {
    "dev": "rsbuild dev",
    "build": "rsbuild build",
    "preview": "rsbuild preview"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.0.0",
    "@repo/ui": "workspace:*",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@module-federation/rsbuild-plugin": "latest",
    "@rsbuild/core": "latest",
    "@rsbuild/plugin-react": "latest",
    "@tanstack/router-plugin": "latest",
    "typescript": "^5.0.0"
  }
}
```

## Step 9: Test the Setup

1. **Start the remote**:

   ```bash
   cd src/modules/profile/client
   npm run dev
   ```

2. **Start the host**:

   ```bash
   cd src/apps/host
   npm run dev
   ```

3. **Test the routes**:
   - Visit `http://localhost:3000/profile` - should load the profile home
   - Visit `http://localhost:3000/profile/settings` - should load profile settings

## Key Points

1. **Single Route Definition**: The remote only defines routes once in its regular TanStack Router structure
2. **Automatic Export**: The `remote-routes.tsx` file simply re-exports the generated route tree
3. **Type Safety**: Full TypeScript support throughout the process
4. **Development Mode**: The remote can run standalone for development
5. **Production Ready**: The same setup works in production with different URLs

## Troubleshooting

- **Routes not appearing**: Check that the remote is running and accessible
- **Build errors**: Ensure all shared dependencies are properly configured
- **Type errors**: Make sure the route tree is properly exported
- **Network errors**: Verify the remote URLs in the manifest are correct
