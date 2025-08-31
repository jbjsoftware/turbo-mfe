import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'dashboard',
  exposes: {
    './App': './src/App.tsx',
  },
  filename: 'remoteEntry.js',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
