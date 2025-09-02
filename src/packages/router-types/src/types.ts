import type { RouteObject } from "react-router";

// Remote manifest types (extend your existing)
export interface RemoteManifestItem {
  name: string;
  entry: string;
  expose?: string;
  basePath: string;
  alias?: string;
  meta?: Record<string, unknown>;
}

// Shared route module contract
export interface RemoteRouteModule {
  Component?: React.ComponentType;
  HydrateFallback?: React.ComponentType;
  ErrorBoundary?: React.ComponentType;
  loader?: any;
  action?: any;
  shouldRevalidate?: any;
  headers?: any;
}

// Module Federation exports contract
export interface RemoteModuleExports {
  createRemoteRouteModule: (opts: {
    basePath: string;
    meta?: unknown;
  }) => Promise<RemoteRouteModule>;
}

// Router configuration types
export interface HostRouterConfig {
  routes: RouteObject[];
  remotes: RemoteManifestItem[];
}

// Navigation types
export interface NavigationState {
  location?: string;
  formData?: FormData;
  state: "idle" | "loading" | "submitting";
}

// Route params base interface that remotes can extend
export interface BaseRouteParams {
  [key: string]: string | undefined;
}

// Shared loader/action argument types
export interface BaseLoaderArgs {
  request: Request;
  params: BaseRouteParams;
}

export interface BaseActionArgs extends BaseLoaderArgs {
  // Additional action-specific properties
}
