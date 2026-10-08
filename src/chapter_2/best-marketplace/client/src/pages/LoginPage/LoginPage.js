import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../store/actions/authActions';
import './LoginPage.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginRequest(data));
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Login</h2>
        
        <div className="form-group">
          <label>Login</label>
          <input
            type="text"
            {...register('login', { required: 'Login is required' })}
          />
          {errors.login && <span className="error">{errors.login.message}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign in'}
        </button>

        <p className="signup-link">
          New to BestMarketPlace? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;