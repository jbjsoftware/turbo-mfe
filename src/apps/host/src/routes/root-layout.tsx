import { Link, Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div>
      <div>Host App</div>

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
