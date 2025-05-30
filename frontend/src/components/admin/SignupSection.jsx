import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../actions/userAction.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './SignupSection.module.css';

const TERMS_URL = "/terms";
const DISCLAIMER_URL = "/disclaimer";

const SignupSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Auto-refresh on mount if on /signup (preventing infinite loop)
  useEffect(() => {
    if (window.location.pathname === '/signup' && !window.location.hash.includes('norefresh')) {
      window.location.replace('/signup#norefresh');
      window.location.reload();
    }
  }, []);

  // User state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Agreements
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);

  // Validation
  const validateForm = () => {
    if (!name || !email || !password || !phoneNumber || !countryCode) {
      return 'All fields are required!';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // Country code must start with + and 1-4 digits after
    const countryCodeRegex = /^\+\d{1,4}$/;
    if (!countryCodeRegex.test(countryCode)) {
      return 'Country code must start with "+" and be 2-5 digits total (like +91, +1, +971)';
    }
    // Phone: only digits, 7-13 digits (without country code)
    const phoneRegex = /^\d{7,13}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return 'Phone number must be 7 to 13 digits (no country code, spaces, or dashes)';
    }
    if (!ageConfirmed || !termsAgreed || !disclaimerAgreed) {
      return 'Please accept all agreements before signing up.';
    }
    return null;
  };

  // Submit Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      alert(validationError);
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const userData = { name, email, password, phoneNumber: fullPhoneNumber };
    try {
      await dispatch(register(userData));
      setErrorMsg('');
      setSuccessMsg('Signup successful! 🚀');
      const isAdmin = email === 'ankitvashist765@gmail.com';
      setTimeout(() => {
        if (isAdmin) {
          navigate('/dashboard');
        } else {
          window.location.href = '/'; // force reload to refresh home page
        }
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Signup failed');
      alert(error.message || 'Signup failed');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.signupBox} onSubmit={handleSignup}>
        <h2 className={styles.title}>Create Your Account</h2>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

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
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* --- Country Code + Phone Row --- */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="+Country Code"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value.replace(/[^+\d]/g, '').slice(0, 5))}
            className={styles.input}
            style={{ maxWidth: 90 }}
            required
            maxLength={5}
          />
          <input
            type="text"
            placeholder="Phone Number (without country code)"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            className={styles.input}
            style={{ flex: 1 }}
            required
            maxLength={13}
          />
        </div>

        {/* --- Agreements Section --- */}
        <div className={styles.agreementSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={e => setAgeConfirmed(e.target.checked)}
            />
            &nbsp;I confirm that I am 18 years of age or older.
          </label>
        </div>
        <div className={styles.agreementSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={e => setTermsAgreed(e.target.checked)}
            />
            &nbsp;I agree to the&nbsp;
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >Terms & Conditions</a>
          </label>
          <div className={styles.termsText}>
            <small>
              By using BetInfo.Live, you agree to our Terms & Conditions.<br />
              <strong>You must be 18+ and betting is at your own risk.</strong>
            </small>
          </div>
        </div>
        <div className={styles.agreementSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={disclaimerAgreed}
              onChange={e => setDisclaimerAgreed(e.target.checked)}
            />
            &nbsp;I acknowledge and accept the&nbsp;
            <a
              href={DISCLAIMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >Disclaimer</a>
          </label>
          <div className={styles.termsText}>
            <small>
              BetInfo.Live provides insights for informational purposes only.<br />
              We do not guarantee results or accuracy. All betting is at your own risk.
            </small>
          </div>
        </div>
        {/* --- End Agreements --- */}

        <button
          type="submit"
          className={styles.button}
          disabled={!ageConfirmed || !termsAgreed || !disclaimerAgreed}
        >
          Sign Up
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignupSection;
