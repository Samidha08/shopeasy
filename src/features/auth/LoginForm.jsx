import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApi';

const initialValues = {
  username: '',
  password: '',
};

const getLoginErrorMessage = (error) =>
  error?.data?.message || 'We could not log you in. Please try again.';

function LoginForm({ onLoginSuccess }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!values.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
      form: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login({
        username: values.username.trim(),
        password: values.password,
      }).unwrap();

      const token = response.accessToken || response.token;

      dispatch(
        setCredentials({
          token,
          user: {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.image,
          },
        })
      );

      toast.success('Logged in successfully.');
      onLoginSuccess();
    } catch (error) {
      const message = getLoginErrorMessage(error);
      setErrors({ form: message });
      toast.error(message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errors.form ? (
        <div className="auth-form__error" role="alert">
          {errors.form}
        </div>
      ) : null}

      <label className="auth-form__field">
        <span className="auth-form__label">Username</span>
        <input
          className="auth-form__input"
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          autoComplete="username"
          disabled={isLoading}
          aria-invalid={Boolean(errors.username)}
        />
        {errors.username ? (
          <span className="auth-form__field-error">{errors.username}</span>
        ) : null}
      </label>

      <label className="auth-form__field">
        <span className="auth-form__label">Password</span>
        <div className="auth-form__password-wrap">
          <input
            className="auth-form__input auth-form__input--password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={Boolean(errors.password)}
          />
          <button
            type="button"
            className="auth-form__toggle"
            onClick={() => setShowPassword((isVisible) => !isVisible)}
            disabled={isLoading}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password ? (
          <span className="auth-form__field-error">{errors.password}</span>
        ) : null}
      </label>

      <button type="submit" className="primary-button auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
