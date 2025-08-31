import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  server: {
    port: 3003,
    cors: {
      origin: '*',
    },
  },
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
});
