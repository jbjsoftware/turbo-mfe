# Dynamic Remote Route Loading

This document explains how to dynamically load remote application routes into the host at runtime using Module Federation and TanStack Router.

## Overview

The system allows the host application to discover and load remote routes at runtime without needing to know about them at build time. This is achieved through:

1. **Remote Manifest**: A JSON file that describes available remotes
2. **Dynamic Route Loading**: Runtime loading of remote route trees
3. **Route Tree Integration**: Merging remote routes into the host route tree

## How It Works

### 1. Remote Manifest (`/public/remote-manifest.json`)

The host loads a manifest file that describes available remotes:

```json
[
  {
    "name": "dashboard",
    "entry": "http://localhost:3001/mf-manifest.json",
    "basePath": "/dashboard",
    "expose": "./routes"
  }
]
```

### 2. Remote Route Export Pattern

Each remote exports its route tree through a standardized module:

```typescript
// src/remote-routes.tsx
import { routeTree } from './routeTree.gen';

export { routeTree };

export const remoteInfo = {
  name: 'dashboard',
  version: '1.0.0',
  basePath: '/dashboard',
  description: 'Dashboard remote application routes',
};

export default {
  routeTree,
  ...remoteInfo,
};
```

### 3. Module Federation Configuration

The remote exposes its routes module:

```typescript
// module-federation.config.ts
export default createModuleFederationConfig({
  name: 'dashboard',
  exposes: {
    './routes': './src/remote-routes',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-router': { singleton: true },
  },
});
```

### 4. Dynamic Loading Process

The host application:

1. Loads the remote manifest
2. Dynamically registers and loads each remote
3. Extracts route trees from loaded remotes
4. Merges remote routes into the host route tree
5. Creates the router with the combined route tree

## Adding a New Remote

To add a new remote application:

### Step 1: Create Remote Route Export

In your remote application, create a `remote-routes.tsx` file:

```typescript
import { routeTree } from './routeTree.gen';

export { routeTree };

export const remoteInfo = {
  name: 'your-remote-name',
  version: '1.0.0',
  basePath: '/your-base-path',
  description: 'Your remote application routes',
};

export default {
  routeTree,
  ...remoteInfo,
};
```

### Step 2: Configure Module Federation

Update your remote's `module-federation.config.ts`:

```typescript
export default createModuleFederationConfig({
  name: 'your-remote-name',
  exposes: {
    './routes': './src/remote-routes',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-router': { singleton: true },
  },
});
```

### Step 3: Update Remote Manifest

Add your remote to the host's `public/remote-manifest.json`:

```json
[
  {
    "name": "your-remote-name",
    "entry": "http://localhost:YOUR_PORT/mf-manifest.json",
    "basePath": "/your-base-path",
    "expose": "./routes"
  }
]
```

## Benefits

1. **Runtime Discovery**: Host doesn't need to know about remotes at build time
2. **Single Route Definition**: Remotes only need one route tree definition
3. **Type Safety**: Full TypeScript support for route trees
4. **Automatic Integration**: Routes are automatically merged into the host
5. **Error Handling**: Graceful fallback if remotes fail to load
6. **Development Friendly**: Easy to add/remove remotes during development

## Error Handling

The system includes comprehensive error handling:

- **Network Failures**: Graceful handling of remote loading failures
- **Invalid Routes**: Validation of remote route structures
- **Fallback Mode**: Host continues to work even if remotes fail
- **Detailed Logging**: Console logging for debugging

## Development vs Production

- **Development**: Remotes are loaded from localhost URLs
- **Production**: Remotes are loaded from production URLs
- **Caching**: Remote routes are cached after first load
- **Hot Reloading**: Changes to remote routes trigger reloads in development

## Troubleshooting

### Remote Not Loading

1. Check the remote manifest URL is accessible
2. Verify the remote's Module Federation configuration
3. Ensure the remote is running and accessible
4. Check browser console for detailed error messages

### Route Conflicts

1. Ensure each remote has a unique `basePath`
2. Check for overlapping route paths
3. Verify route tree structure in remotes

### Type Issues

1. Ensure all remotes export their route tree correctly
2. Check that shared dependencies are properly configured
3. Verify TypeScript configuration across host and remotes
