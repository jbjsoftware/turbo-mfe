/**
 * Utility to test remote connection and debug Module Federation issues
 */

export async function testRemoteConnection(
  remoteName: string,
  remoteUrl: string,
) {
  console.log(`🧪 Testing remote connection: ${remoteName} at ${remoteUrl}`);

  // Test 1: Check if mf-manifest.json is accessible
  try {
    const manifestResponse = await fetch(remoteUrl);
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      console.log(`✅ Manifest accessible:`, manifest);

      // Extract publicPath and remoteEntry from manifest
      const publicPath = manifest.metaData?.publicPath || '';
      const remoteEntryName =
        manifest.metaData?.remoteEntry?.name || 'remoteEntry.js';
      const remoteEntryUrl = `${publicPath}${remoteEntryName}`;

      console.log(`🔍 Remote entry URL: ${remoteEntryUrl}`);

      // Test 2: Check if remoteEntry.js is accessible
      try {
        const entryResponse = await fetch(remoteEntryUrl, { method: 'HEAD' });
        if (entryResponse.ok) {
          console.log(`✅ Remote entry accessible`);

          // Test 3: Check exposed modules
          const exposes = manifest.exposes || [];
          console.log(
            `🔍 Exposed modules:`,
            exposes.map((exp: any) => exp.name),
          );

          return {
            success: true,
            manifest,
            remoteEntryUrl,
            exposes,
          };
        } else {
          console.error(
            `❌ Remote entry not accessible: ${entryResponse.status}`,
          );
          return { success: false, error: 'Remote entry not accessible' };
        }
      } catch (entryError) {
        console.error(`❌ Error checking remote entry:`, entryError);
        return { success: false, error: entryError };
      }
    } else {
      console.error(`❌ Manifest not accessible: ${manifestResponse.status}`);
      return { success: false, error: 'Manifest not accessible' };
    }
  } catch (manifestError) {
    console.error(`❌ Error fetching manifest:`, manifestError);
    return { success: false, error: manifestError };
  }
}

export async function testAllRemotes(
  manifest: Array<{ name: string; entry: string }>,
) {
  console.log(`🧪 Testing all remotes...`);

  const results = [];
  for (const remote of manifest) {
    const result = await testRemoteConnection(remote.name, remote.entry);
    results.push({ ...remote, ...result });
  }

  console.log(`🧪 Test results:`, results);
  return results;
}
