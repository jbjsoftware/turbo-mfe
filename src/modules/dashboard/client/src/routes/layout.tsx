import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Outlet, useNavigate, useLocation } from 'react-router';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    // Use relative navigation - React Router will handle the context correctly
    navigate(value);
  };

  return (
    <div>
      <header className="flex flex-col gap-3 p-2">
        <h1>Dashboard Layout</h1>

        <Tabs defaultValue="one" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
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
};

export default Layout;
