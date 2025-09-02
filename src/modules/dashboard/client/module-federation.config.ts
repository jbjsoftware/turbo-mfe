import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'dashboard',
  filename: 'remoteEntry.js',
  exposes: {
    './routes': './src/routes/route-definitions.tsx',
  },
  dts: {
    generateTypes: process.env.NODE_ENV === 'production', // off in dev
    consumeTypes: true, // fine to keep on
    // Or simply: dts: false, to fully disable in dev
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router': { singleton: true },
    '@repo/router-types': { singleton: true },
  },
});
