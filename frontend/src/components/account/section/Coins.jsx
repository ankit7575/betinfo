import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import './Coins.css';

const Coins = ({ user }) => {
  const [showUsedCoins, setShowUsedCoins] = useState(false);
  const [showExpiredCoins, setShowExpiredCoins] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const now = new Date();
  const allCoins = user?.keys?.flatMap((key) => key.coin || []) || [];

  const expiredCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    const expiryTime = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
    return now > expiryTime;
  });
  const usedCoins = allCoins.filter((coin) => {
    if (!coin.usedAt) return false;
    const usedDate = new Date(coin.usedAt);
    const expiryTime = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
    return now <= expiryTime;
  });
  const unusedCoins = allCoins.filter((coin) => !coin.usedAt);

  const displayedCoins = showUsedCoins
    ? usedCoins
    : showExpiredCoins
    ? expiredCoins
    : unusedCoins;

  const handleCopyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert('Coin code copied to clipboard!'))
      .catch((error) => alert('Failed to copy the coin code: ' + error));
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
      {message && (
        <div className="coin-message" style={{ color: message.toLowerCase().startsWith('error') ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      {/* Button to navigate to home/matches page */}
      <div style={{ margin: '20px 0' }}>
        <button
          className="go-to-matches-btn"
          onClick={() => navigate('/')}
          style={{ padding: '10px 28px', fontSize: '1rem', fontWeight: 600, background: '#065ad8', color: 'white', border: 'none', borderRadius: 6 }}
        >
          Go to Matches to Redeem Coin
        </button>
      </div>

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
                  <td data-label="Copy Code">
                    <button onClick={() => handleCopyToClipboard(coin.shareableCode)}>
                      Copy Code
                    </button>
                  </td>
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
