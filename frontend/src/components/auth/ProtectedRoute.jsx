import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for authentication (using localStorage as a simple mock)
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuthenticated) {
    // If not authenticated, redirect to the landing page
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
