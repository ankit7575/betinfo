import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { redeemCoinForAllMatches } from '../actions/coinAction';
import { loadUser } from '../actions/userAction';
import { Helmet } from 'react-helmet';
import './RedeemCoinPage.css';
import AppLayout from '../layout';
import Footer from '../components/Footer';

const RedeemCoinPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [showUsedCoins, setShowUsedCoins] = useState(false);
  const [showExpiredCoins, setShowExpiredCoins] = useState(false);

  useEffect(() => {
    if (!user) dispatch(loadUser());
  }, [dispatch, user]);

  const now = new Date();
  const allCoins = user?.keys?.flatMap((key) => key.coin || []) || [];

  const expiredCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    return now > new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
  });

  const usedCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    return now <= new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
  });

  const unusedCoins = allCoins.filter((coin) => !coin.usedAt);

  const displayedCoins = showUsedCoins
    ? usedCoins
    : showExpiredCoins
    ? expiredCoins
    : unusedCoins;

  const hasAccessForNext24Hours = () => {
    return allCoins.some((coin) => {
      if (!coin.usedAt || !coin.expiresAt) return false;
      return new Date(coin.expiresAt) > now;
    });
  };

  const handleCopyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert('Coin code copied to clipboard!'))
      .catch((err) => alert('Failed to copy the code: ' + err));
  };

  const redeemCoin = async (coinId) => {
    setMessage('');

    if (hasAccessForNext24Hours()) {
      setMessage('⚠️ You already have an active coin in use. Please wait until it expires.');
      return;
    }

    const coin = allCoins.find((c) => c.id === coinId || c._id === coinId);
    if (!coin) {
      setMessage(`❌ Coin ${coinId} not found.`);
      return;
    }

    if (coin.usedAt) {
      setMessage(`⚠️ Coin ${coinId} is already in use.`);
      return;
    }

    try {
      await dispatch(redeemCoinForAllMatches(coinId));
      setMessage(`✅ Coin ${coinId} redeemed successfully for access to all matches for 24 hours.`);
      setTimeout(() => navigate('/#viewtip'), 1500); // Navigate to homepage after short delay
    } catch (error) {
      setMessage(`❌ Coin ${coinId}: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Redeem Coin</title>
        <meta name="description" content="Use your coin to unlock 24-hour access to all matches." />
      </Helmet>

      <AppLayout />

      <div className="coins-container pt-5">
        <h2>Redeem Coin</h2>

        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            {message && <div className="coin-message">{message}</div>}

            <div className="toggle-container">
              <button
                className={`toggle-button ${!showUsedCoins && !showExpiredCoins ? 'active' : ''}`}
                onClick={() => {
                  setShowUsedCoins(false);
                  setShowExpiredCoins(false);
                  setMessage('');
                }}
              >
                Show Unused Coins
              </button>
              <button
                className={`toggle-button ${showUsedCoins ? 'active' : ''}`}
                onClick={() => {
                  setShowUsedCoins(true);
                  setShowExpiredCoins(false);
                  setMessage('');
                }}
              >
                Show Used Coins
              </button>
              <button
                className={`toggle-button ${showExpiredCoins ? 'active' : ''}`}
                onClick={() => {
                  setShowExpiredCoins(true);
                  setShowUsedCoins(false);
                  setMessage('');
                }}
              >
                Show Expired Coins
              </button>
            </div>

            <table className="coins-table">
              <thead>
                <tr>
                  <th>Coin Code</th>
                  {(showUsedCoins || showExpiredCoins) && <th>Used At</th>}
                  {!showUsedCoins && !showExpiredCoins && <th>Copy</th>}
                  {!showUsedCoins && !showExpiredCoins && <th>Redeem</th>}
                </tr>
              </thead>
              <tbody>
                {displayedCoins.length === 0 ? (
                  <tr>
                    <td colSpan="4">No coins available in this category.</td>
                  </tr>
                ) : (
                  displayedCoins.map((coin) => {
                    const coinId = coin.id || coin._id;
                    return (
                      <tr key={coinId}>
                        <td>{coin.shareableCode || 'N/A'}</td>
                        {(showUsedCoins || showExpiredCoins) && (
                          <td>{new Date(coin.usedAt).toLocaleString()}</td>
                        )}
                        {!showUsedCoins && !showExpiredCoins && (
                          <>
                            <td>
                              <button onClick={() => handleCopyToClipboard(coin.shareableCode)}>
                                Copy
                              </button>
                            </td>
                            <td>
                              <button onClick={() => redeemCoin(coinId)}>Redeem</button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default RedeemCoinPage;
