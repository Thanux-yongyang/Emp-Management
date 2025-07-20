import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Navigation } from '../Navbar/Navigation';

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Navigation />
      <main className="flex-1 ml-64 ">
        <Outlet />
      </main>
    </div>
  );
};