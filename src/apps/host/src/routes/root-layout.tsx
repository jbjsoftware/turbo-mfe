import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@repo/ui/components/ui/sidebar';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div className="flex flex-row h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-col flex-1">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </div>
  );
};

export default RootLayout;
