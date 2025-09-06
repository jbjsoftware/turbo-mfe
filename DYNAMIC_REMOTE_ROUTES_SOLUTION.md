# Dynamic Remote Routes Solution

## Overview

This solution enables dynamic loading of remote application routes into a host application at runtime using Module Federation and TanStack Router. The key benefits are:

- **Runtime Discovery**: Host discovers remotes at runtime, not build time
- **Single Route Definition**: Remotes only need one route tree definition
- **Type Safety**: Full TypeScript support throughout
- **Easy Reproduction**: Consistent, standardized pattern for all remotes
- **Error Handling**: Graceful fallback when remotes fail to load

## Architecture

### 1. Remote Manifest System

- `public/remote-manifest.json` describes available remotes
- Host loads manifest at startup to discover remotes
- Each remote entry specifies name, URL, base path, and exposed module

### 2. Standardized Remote Export Pattern

- Each remote exports its route tree via `remote-routes.tsx`
- Uses `@repo/remote-utils` for consistent export structure
- Validates remote exports to ensure compatibility

### 3. Dynamic Route Loading

- Host loads remote modules using Module Federation Enhanced
- Extracts route trees from loaded remotes
- Merges remote routes into host route tree at specified base paths

### 4. Runtime Integration

- Router created with combined route tree
- Full type safety maintained throughout process
- Fallback to host-only routes if remotes fail

## Key Files Created

### Host Application

- `src/apps/host/src/utils/dynamic-routes.ts` - Core dynamic loading logic
- `src/apps/host/src/bootstrap.tsx` - Updated to support dynamic routes
- `src/apps/host/src/runtime-plugins/dynamic-remote-loader.ts` - Module Federation runtime plugin

### Remote Utilities Package

- `src/packages/remote-utils/src/create-remote-routes.ts` - Helper for creating standardized exports
- `src/packages/remote-utils/src/index.ts` - Package exports

### Dashboard Remote (Example)

- `src/modules/dashboard/client/src/remote-routes.tsx` - Route export using utility

### Documentation

- `src/apps/host/DYNAMIC_ROUTES.md` - Detailed implementation guide
- `EXAMPLE_REMOTE_SETUP.md` - Step-by-step remote creation example

## Usage Flow

1. **Remote Development**:

   ```typescript
   // src/remote-routes.tsx
   import { routeTree } from "./routeTree.gen";
   import { createRemoteExport } from "@repo/remote-utils";

   export default createRemoteExport(routeTree, {
     name: "my-remote",
     version: "1.0.0",
     basePath: "/my-remote",
   });
   ```

2. **Module Federation Config**:

   ```typescript
   exposes: {
     './routes': './src/remote-routes',
   }
   ```

3. **Update Manifest**:

   ```json
   {
     "name": "my-remote",
     "entry": "http://localhost:3002/mf-manifest.json",
     "basePath": "/my-remote",
     "expose": "./routes"
   }
   ```

4. **Automatic Integration**: Host automatically discovers and loads the remote

## Benefits Achieved

✅ **Runtime Loading**: Host doesn't need to know about remotes at build time
✅ **Single Definition**: Remotes use standard TanStack Router setup
✅ **Easy Reproduction**: Consistent pattern for all remotes
✅ **Type Safety**: Full TypeScript support maintained
✅ **Error Handling**: Graceful fallback if remotes fail
✅ **Development Friendly**: Easy to add/remove remotes during development

## Production Considerations

- **Caching**: Remote routes are cached after first load
- **Error Recovery**: System continues to work if individual remotes fail
- **Performance**: Routes are loaded asynchronously without blocking
- **Monitoring**: Comprehensive logging for debugging and monitoring

## Next Steps

1. Test the implementation with the existing dashboard remote
2. Create additional remotes following the established pattern
3. Add monitoring and analytics for remote loading success/failure
4. Consider adding remote versioning and compatibility checks
5. Implement remote hot-reloading for development

This solution provides a robust, scalable foundation for micro-frontend architecture with TanStack Router while maintaining type safety and developer experience.
