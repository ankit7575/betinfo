import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../actions/userAction.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing the eye icons
import styles from './SignupSection.module.css';

const SignupSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const validateForm = () => {
    if (!name || !email || !password || !phoneNumber) {
      return 'All fields are required!';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return 'Phone number must be 10 to 15 digits';
    }

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      setSuccessMsg('');
      return;
    }

    const userData = { name, email, password, phoneNumber };

    try {
      await dispatch(register(userData)); // `register` now throws on error

      setErrorMsg('');
      setSuccessMsg('Signup successful! 🚀');

      const isAdmin = email === 'ankitvashist765@gmail.com';
      setTimeout(() => navigate(isAdmin ? '/dashboard' : '/payment'), 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Signup failed');
      setSuccessMsg('');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.signupBox} onSubmit={handleSignup}>
        <h2 className={styles.title}>Create Your Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between text and password
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate('/login')}
        >
          Login
        </button>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}
      </form>
    </div>
  );
};

export default SignupSection;
