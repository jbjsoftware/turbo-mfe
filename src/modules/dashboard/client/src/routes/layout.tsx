import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Outlet, useNavigate } from 'react-router';

const Layout = () => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(`${value}`, { relative: 'path' });
  };

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1>Dashboard Layout</h1>

        <Tabs defaultValue="one" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="flex flex-col h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
