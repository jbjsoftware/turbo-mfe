import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@repo/ui/components/ui/sidebar';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex flex-row h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <main className="flex flex-col flex-1">
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
