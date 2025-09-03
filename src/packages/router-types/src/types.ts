import type { RouteObject } from 'react-router';

// Remote manifest types (extend your existing)
export interface RemoteManifestItem {
  name: string;
  entry: string;
  expose?: string;
  basePath: string;
  alias?: string;
  meta?: Record<string, unknown>;
}

// Module Federation exports contract - remotes export RouteObject arrays
export interface RemoteModuleExports {
  // Default export should be RouteObject[]
  default?: RouteObject[];

  // Named route exports (common patterns but not limited to these)
  routes?: RouteObject[];

  // Allow any named route exports discovered at runtime
  [routeName: string]: RouteObject[] | React.ComponentType | undefined;
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
  state: 'idle' | 'loading' | 'submitting';
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
