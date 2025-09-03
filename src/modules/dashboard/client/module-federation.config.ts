import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'dashboard',
  exposes: {
    './App': './src/routeTree.gen',
  },
  filename: 'remoteEntry.js',
  dts: {
    generateTypes: process.env.NODE_ENV === 'production', // off in dev
    consumeTypes: true, // fine to keep on
    // Or simply: dts: false, to fully disable in dev
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-router': { singleton: true },
    '@repo/ui': { singleton: true },
  },
});
