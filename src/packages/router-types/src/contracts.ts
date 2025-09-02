import {
  BaseActionArgs,
  BaseLoaderArgs,
  BaseRouteParams,
  RemoteModuleExports,
} from "./types.js";

// Contract definitions for MFE communication
export interface RemoteRouteContract {
  // What the host expects from remotes
  routeExports: {
    createRemoteRouteModule: RemoteModuleExports["createRemoteRouteModule"];
  };

  // Optional route metadata
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    permissions?: string[];
  };
}

// Type-safe remote route factory
export type CreateRemoteRoute<
  TParams extends BaseRouteParams = BaseRouteParams,
> = (opts: { basePath: string; meta?: unknown }) => Promise<{
  Component?: React.ComponentType<{ params: TParams }>;
  loader?: (args: BaseLoaderArgs & { params: TParams }) => any;
  action?: (args: BaseActionArgs & { params: TParams }) => any;
  ErrorBoundary?: React.ComponentType;
}>;
