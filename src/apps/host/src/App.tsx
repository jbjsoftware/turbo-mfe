import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { lazy, Suspense } from 'react';

const About = lazy(() => import('about/App' as any));
const Profile = lazy(() => import('profile/App' as any));
const Dashboard = lazy(() => import('dashboard/App' as any));

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Host</h1>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Suspense fallback={<div>Loading...</div>}>
            <About />
          </Suspense>
        </TabsContent>
        <TabsContent value="dashboard">
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        </TabsContent>
        <TabsContent value="profile">
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
