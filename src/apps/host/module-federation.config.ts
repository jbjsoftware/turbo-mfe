import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'host',
  remotes: {
    // about: 'about@http://localhost:3002/remoteEntry.js',
    // dashboard: 'dashboard@http://localhost:3001/remoteEntry.js',
    // profile: 'profile@http://localhost:3003/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router': { singleton: true },
  },
});
