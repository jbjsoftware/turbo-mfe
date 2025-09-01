// apps/host/src/remotes.ts
import { registerRemotes } from '@module-federation/enhanced/runtime';

export type RemoteManifestItem = {
  name: string; // remote scope, e.g. "remote_dashboard"
  entry: string; // URL to that remote's mf-manifest.json
  expose?: string; // default "./routes" (for your route factory)
  basePath: string; // where to mount in the host router, e.g. "/dashboard"
  alias?: string; // optional alias (lets you decouple URL vs public name)
  meta?: Record<string, unknown>;
};

export async function bootstrapRemotes() {
  const res = await fetch('/remote-manifest.json', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch remotes manifest');

  const manifest: RemoteManifestItem[] = await res.json();

  // Enhanced runtime: register mf-manifest.json endpoints at runtime
  await registerRemotes(
    manifest.map((m) => ({
      name: m.name,
      alias: m.alias, // optional
      entry: m.entry, // <--- points to mf-manifest.json
    })),
  );

  return manifest;
}
