import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from './routePaths';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
