import React, { useState } from 'react';
import './RedeemCoins.css';

const RedeemCoins = ({ coins = [], onRedeem }) => {
  const [selectedCoinId, setSelectedCoinId] = useState('');

  const handleRedeem = () => {
    if (selectedCoinId) {
      onRedeem(selectedCoinId);
    } else {
      alert('Please select a coin to redeem.');
    }
  };

  return (
    <div className="redeem-coins-section">
      <h2>Redeem Your Coin</h2>
      <div className="select-coin-container">
        <label htmlFor="coin-select">Select Coin:</label>
        <select
          id="coin-select"
          value={selectedCoinId}
          onChange={(e) => setSelectedCoinId(e.target.value)}
        >
          <option value="">-- Select a Coin --</option>
          {coins.length > 0 ? (
            coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.shareableCode}
                {coin.expiresAt && coin.expiresAt.$date
                  ? ` - Expires at: ${new Date(coin.expiresAt.$date).toLocaleString()}`
                  : ''}
              </option>
            ))
          ) : (
            <option disabled>No coins available</option>
          )}
        </select>
      </div>

      <button className="redeem-button" onClick={handleRedeem}>
        Redeem Coin
      </button>
    </div>
  );
};

export default RedeemCoins;
