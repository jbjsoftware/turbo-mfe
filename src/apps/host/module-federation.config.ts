import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'host',
  // Empty remotes - we'll load them dynamically at runtime
  remotes: {},
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-router': { singleton: true },
    '@repo/ui': { singleton: true },
  },
});
