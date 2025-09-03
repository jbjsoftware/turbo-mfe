import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'profile',
  exposes: {
    './App': './src/App.tsx',
  },
  filename: 'remoteEntry.js',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@repo/ui': { singleton: true },
  },
});
