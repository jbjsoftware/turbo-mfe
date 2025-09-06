import { routeTree } from './routeTree.gen';

// Route tree is ready for export

// Export the complete route tree (with children) for the host to consume
export { routeTree };

// Export additional metadata about the remote
export const remoteInfo = {
  name: 'dashboard',
  version: '1.0.0',
  basePath: '/dashboard',
  description: 'Dashboard remote application routes',
};

// Default export
export default {
  routeTree,
  remoteInfo,
};
