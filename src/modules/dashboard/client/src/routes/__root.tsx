import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import {
  Outlet,
  useNavigate,
  createRootRoute,
  Link,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Layout,
});

function Layout() {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    // Use relative navigation - should work within the current route context
    navigate({ to: `${value}` });
  };

  return (
    <div>
      <header className="flex flex-col gap-3 p-2">
        <h1>
          <Link to="/">Dashboard Layout</Link>
        </h1>

        <Tabs defaultValue="foo">
          <TabsList>
            <TabsTrigger value="foo">
              <Link to="/foo">Foo</Link>
            </TabsTrigger>
            <TabsTrigger value="bar">
              <Link to="/bar">Bar</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="flex flex-col h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default Layout;
