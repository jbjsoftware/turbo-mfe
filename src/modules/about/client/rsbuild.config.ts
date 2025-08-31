import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  server: {
    port: 3002,
    cors: {
      origin: '*',
    },
  },
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
});
