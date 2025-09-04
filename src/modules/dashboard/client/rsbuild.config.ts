import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';

import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  server: {
    port: 3001,
    cors: {
      origin: '*',
    },
  },
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          // autoCodeSplitting: true,
          virtualRouteConfig: './src/routes.ts',
        }),
      ],
    },
  },
});
