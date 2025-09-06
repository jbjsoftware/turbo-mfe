import React from 'react';
import { RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';

import { startRouter } from './routes/router';
import RootProvider from './providers/root-provider';

(async () => {
  const root = createRoot(document.getElementById('root')!);

  try {
    const router = await startRouter();

    root.render(
      <React.StrictMode>
        <RootProvider>
          <RouterProvider router={router} />
        </RootProvider>
      </React.StrictMode>,
    );
  } catch (e) {
    root.render(<div style={{ padding: 24 }}>Failed to start app.</div>);
  }
})();
