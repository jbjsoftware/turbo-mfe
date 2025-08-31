import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'about',
  exposes: {
    './App': './src/App.tsx',
  },
  filename: 'remoteEntry.js',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
