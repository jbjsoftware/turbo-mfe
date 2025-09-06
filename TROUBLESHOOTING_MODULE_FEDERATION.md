# Troubleshooting Module Federation Runtime Issues

## Common Error: RUNTIME-004 - Failed to locate remote

### Error Message

```
Error loading remote module dashboard: Error: [ Federation Runtime ]: Failed to locate remote. #RUNTIME-004
```

### Causes and Solutions

#### 1. **Incorrect Entry Point URL**

**Problem**: Using `mf-manifest.json` instead of `remoteEntry.js`

**Solution**:

- Update the remote manifest to use `remoteEntry.js`:

```json
{
  "name": "dashboard",
  "entry": "http://localhost:3001/remoteEntry.js", // ✅ Correct
  "basePath": "/dashboard",
  "expose": "./routes"
}
```

Instead of:

```json
{
  "name": "dashboard",
  "entry": "http://localhost:3001/mf-manifest.json", // ❌ Incorrect
  "basePath": "/dashboard",
  "expose": "./routes"
}
```

#### 2. **Remote Not Running**

**Problem**: The remote application is not running or not accessible

**Solution**:

- Ensure the dashboard remote is running: `npm run dev` in the dashboard directory
- Verify the remote is accessible at the specified URL
- Check that the remote is running on the correct port (3001 in this example)

#### 3. **Module Federation Configuration Issues**

**Problem**: Remote not properly configured to expose modules

**Solution**: Verify the remote's `module-federation.config.ts`:

```typescript
export default createModuleFederationConfig({
  name: "dashboard", // Must match the name in manifest
  exposes: {
    "./routes": "./src/remote-routes", // Must match expose in manifest
  },
  filename: "remoteEntry.js", // Must generate remoteEntry.js
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@tanstack/react-router": { singleton: true },
  },
});
```

#### 4. **CORS Issues**

**Problem**: Cross-origin requests blocked

**Solution**:

- Ensure the remote server has proper CORS configuration
- For development, both host and remote should be on localhost
- Check browser console for CORS errors

#### 5. **Shared Dependencies Mismatch**

**Problem**: Version conflicts in shared dependencies

**Solution**: Ensure both host and remote have compatible shared dependency configurations:

```typescript
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
  '@tanstack/react-router': { singleton: true },
  // Add other shared dependencies
},
```

### Debugging Steps

1. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - Look for failed requests to `remoteEntry.js`
   - Verify the remote URL is accessible

2. **Console Logging**:
   - Enable detailed logging in the dynamic routes utility
   - Check for registration and loading messages
   - Look for error details in console

3. **Manual Testing**:
   - Try accessing the remote entry directly: `http://localhost:3001/remoteEntry.js`
   - Should return JavaScript code, not 404

4. **Verify Remote Export**:
   - Check that the remote properly exports the route tree
   - Ensure the export structure matches expected format

### Example Working Setup

**Host Manifest** (`public/remote-manifest.json`):

```json
[
  {
    "name": "dashboard",
    "entry": "http://localhost:3001/remoteEntry.js",
    "basePath": "/dashboard",
    "expose": "./routes"
  }
]
```

**Remote Export** (`src/remote-routes.tsx`):

```typescript
import { routeTree } from "./routeTree.gen";

export { routeTree };

export const remoteInfo = {
  name: "dashboard",
  version: "1.0.0",
  basePath: "/dashboard",
};

export default {
  routeTree,
  remoteInfo,
};
```

**Remote Module Federation Config**:

```typescript
export default createModuleFederationConfig({
  name: "dashboard",
  exposes: {
    "./routes": "./src/remote-routes",
  },
  filename: "remoteEntry.js",
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@tanstack/react-router": { singleton: true },
  },
});
```

### Additional Tips

- **Development vs Production**: URLs will be different in production
- **Port Conflicts**: Ensure each remote runs on a unique port
- **Build Order**: Build remotes before the host in production
- **Caching**: Clear browser cache if making configuration changes
- **Hot Reloading**: May need to restart both host and remote after config changes

### Testing the Fix

1. Start the dashboard remote: `cd src/modules/dashboard/client && npm run dev`
2. Start the host: `cd src/apps/host && npm run dev`
3. Navigate to `http://localhost:3000/dashboard`
4. Check browser console for successful loading messages
5. Verify routes are working correctly
