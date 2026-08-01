import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router';
import '../auth.form.scss';
import { useAuth } from '../hooks/useAuth';
import { loginValidationSchema } from '../validationSchema/loginValidationSchema';

import LoginSkeleton from '../components/LoginSkeleton';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
      navigate('/');
    },
  });

  if (loading) {
    return (
      <main>
        <LoginSkeleton />
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
            />
          </div>

          <button type="submit" className="button primary-button">
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};
export default Login;
