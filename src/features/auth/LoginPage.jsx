import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../routes/routePaths';
import LoginForm from './LoginForm';
import { selectIsAuthenticated } from './authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const from = location.state?.from?.pathname || ROUTES.HOME;
  const search = location.state?.from?.search || '';
  const redirectTo = `${from}${search}`;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="landing-section__eyebrow">Account</span>
          <h1 className="auth-card__title">Login to ShopEasy</h1>
          <p className="auth-card__description">
            Use your ShopEasy account to continue shopping and checkout.
          </p>
        </div>

        <LoginForm onLoginSuccess={() => navigate(redirectTo, { replace: true })} />
      </div>
    </section>
  );
}

export default LoginPage;
