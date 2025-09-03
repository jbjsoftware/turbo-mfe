import { Link, Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div>
      <div className="text-2xl font-bold bg-blue-500 text-white p-4">
        <Link to="/">Host App</Link>
      </div>

      <nav>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default RootLayout;
