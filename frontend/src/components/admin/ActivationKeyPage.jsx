import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivationKeyPage.module.css';

const ActivationKeyPage = () => {
  const [activationKey, setActivationKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Simulating key creation without using Redux
  useEffect(() => {
    const fetchActivationKey = () => {
      setLoading(true);
      setError('');
      // Simulate key creation (you can replace this with an API call)
      setTimeout(() => {
        const newKey = '1234-ABCD-5678-EFGH'; // Example key
        setActivationKey(newKey);
        setSuccess(true);
        setLoading(false);
      }, 2000); // Simulating a delay for key creation
    };

    // If no activation key is set, simulate key creation
    if (!activationKey) {
      fetchActivationKey();
    }
  }, [activationKey]);

  // Function to copy activation key to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(activationKey).then(() => {
      alert('Activation key copied to clipboard!');
    });
  };

  // Function to navigate to Login/Signup page
  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.activationBox}>
        <h2 className={styles.title}>Your Activation Key</h2>

        <div className={styles.keyContainer}>
          <input
            type="text"
            value={activationKey}
            readOnly
            className={styles.activationKey}
          />
          <button onClick={handleCopy} className={styles.copyButton}>
            Copy
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Key Created Successfully!</p>}

        <p className={styles.note}>
          This key is required to complete your activation process. Please save it.
        </p>

        <div className={styles.buttons}>
          <button onClick={handleGoToLogin} className={styles.button}>
            Go to Login
          </button>
          <button onClick={handleGoToSignup} className={styles.button}>
            Go to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationKeyPage;
