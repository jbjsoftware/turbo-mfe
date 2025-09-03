// routes.ts
import { rootRoute, route, index } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('layout.tsx', [
  index('default.tsx'),
  route('/bar', 'bar.tsx'),
  route('/foo', 'foo.tsx'),
]);
