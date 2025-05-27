import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { redeemCoinForAllMatches } from '../../../actions/coinAction';
import { Helmet } from 'react-helmet';
import './Coins.css';

const Coins = ({ user }) => {
  const [showUsedCoins, setShowUsedCoins] = useState(false);
  const [showExpiredCoins, setShowExpiredCoins] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const now = new Date();
  const allCoins = user?.keys?.flatMap((key) => key.coin || []) || [];

  // Define expired coins: usedAt more than 24 hours ago
  const expiredCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    const expiryTime = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
    return now > expiryTime;
  });

  // Define used coins: usedAt within last 24 hours
  const usedCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    const expiryTime = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
    return now <= expiryTime;
  });

  // Define unused coins
  const unusedCoins = allCoins.filter((coin) => !coin.usedAt);

  // Which coins to display
  const displayedCoins = showUsedCoins
    ? usedCoins
    : showExpiredCoins
    ? expiredCoins
    : unusedCoins;

  // Check if user has access based on any unexpired used coin
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
      .catch((error) => alert('Failed to copy the coin code: ' + error));
  };

  const redeemCoin = async (coinId) => {
    setMessage('');

    if (hasAccessForNext24Hours()) {
      setMessage('You already have an active coin in use. Please wait until it expires.');
      return;
    }

    const coin = allCoins.find((c) => c.id === coinId || c._id === coinId);
    if (!coin) {
      setMessage(`Coin ${coinId} not found.`);
      return;
    }

    if (coin.usedAt) {
      setMessage(`Coin ${coinId} is already in use.`);
      return;
    }

    try {
      await dispatch(redeemCoinForAllMatches(coinId));
      setMessage(`Coin ${coinId} redeemed successfully for access to all matches for 24 hours.`);
      navigate('/');
    } catch (error) {
      setMessage(`Coin ${coinId}: ${error.message}`);
    }
  };

  if (allCoins.length === 0) {
    return <p>No coins available.</p>;
  }

  return (
    <div className="coins-container">
      <Helmet>
        <title>Your Coins</title>
        <meta name="description" content="Manage your coins and redeem them for access to all matches." />
      </Helmet>

      <h2>Your Coins</h2>
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
            {showUsedCoins && <th>Used At</th>}
            {showExpiredCoins && <th>Used At</th>}
            {!showUsedCoins && !showExpiredCoins && <th>Copy Code</th>}
            {!showUsedCoins && !showExpiredCoins && <th>Redeem Code</th>}
          </tr>
        </thead>
        <tbody>
          {displayedCoins.map((coin) => {
            const coinId = coin.id || coin._id;
            return (
              <tr key={coinId}>
                <td data-label="Coin Code">{coin.shareableCode || 'N/A'}</td>
                {(showUsedCoins || showExpiredCoins) && (
                  <td data-label="Used At">{new Date(coin.usedAt).toLocaleString()}</td>
                )}
                {!showUsedCoins && !showExpiredCoins && (
                  <>
                    <td data-label="Copy Code">
                      <button onClick={() => handleCopyToClipboard(coin.shareableCode)}>
                        Copy Code
                      </button>
                    </td>
                    <td data-label="Redeem Code">
                      <button onClick={() => redeemCoin(coinId)}>Redeem Code</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Coins;
