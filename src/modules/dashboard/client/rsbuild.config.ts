import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  server: {
    port: 3001,
    cors: {
      origin: '*',
    },
  },
  dev: {
    lazyCompilation: {
      entries: false,
      imports: false,
    },
  },
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
});
