import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/userAction.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing the eye icons
import styles from './LoginSection.module.css';

const LoginSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await dispatch(login(email, password)); // should throw on error
    } catch (error) {
      setErrorMsg(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginBox} onSubmit={handleLogin}>
        <h2 className={styles.title}>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between text and password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on state */}
          </button>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          className={styles.signupButton}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>

        <button
          type="button"
          className={styles.homeButton}
          onClick={() => navigate('/')}
        >
          Home
        </button>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginSection;
