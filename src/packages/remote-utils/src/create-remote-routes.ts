// Using any to avoid version conflicts between host and remotes
type AnyRoute = any;

export interface RemoteInfo {
  name: string;
  version: string;
  basePath: string;
  description?: string;
}

export interface RemoteRouteExport {
  routeTree: AnyRoute;
  remoteInfo: RemoteInfo;
}

/**
 * Creates a standardized remote route export
 * This helper ensures consistency across all remotes
 */
export function createRemoteRoutes(
  routeTree: AnyRoute,
  info: RemoteInfo
): RemoteRouteExport {
  return {
    routeTree,
    remoteInfo: {
      ...info,
      description: info.description || `${info.name} remote application routes`,
    },
  };
}

/**
 * Type guard to validate remote route exports
 */
export function isValidRemoteRouteExport(
  module: any
): module is RemoteRouteExport {
  return (
    module &&
    typeof module === "object" &&
    module.routeTree &&
    module.remoteInfo &&
    typeof module.remoteInfo.name === "string" &&
    typeof module.remoteInfo.version === "string" &&
    typeof module.remoteInfo.basePath === "string"
  );
}

/**
 * Default export factory for convenience
 */
export function createRemoteExport(routeTree: AnyRoute, info: RemoteInfo) {
  const remoteExport = createRemoteRoutes(routeTree, info);

  return {
    // Named exports
    routeTree: remoteExport.routeTree,
    remoteInfo: remoteExport.remoteInfo,

    // Default export
    default: remoteExport,
  };
}
