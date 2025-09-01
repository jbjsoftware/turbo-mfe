import React from 'react';
import { RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';

import { UIProvider } from '@repo/ui/providers/ui-provider';
import { startRouter } from './routes/router';

(async () => {
  const root = createRoot(document.getElementById('root')!);

  // Optional: show a very small shell while we prepare the router
  root.render(<div style={{ padding: 24 }}>Loading…</div>);

  try {
    const router = await startRouter();

    root.render(
      <React.StrictMode>
        <UIProvider>
          <RouterProvider router={router} />
        </UIProvider>
      </React.StrictMode>,
    );
  } catch (e) {
    root.render(<div style={{ padding: 24 }}>Failed to start app.</div>);
    // Optionally report error
  }
})();

// const rootEl = document.getElementById('root');
// if (rootEl) {
//   const root = ReactDOM.createRoot(rootEl);
//   root.render(
//     <React.StrictMode>
//       <UIProvider>
//         <App />
//       </UIProvider>
//     </React.StrictMode>,
//   );
// }
