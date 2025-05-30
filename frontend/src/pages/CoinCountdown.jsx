import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../actions/userAction';
import './CoinCountdown.css';

const CoinCountdown = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const [timeLeft, setTimeLeft] = useState(null);

  // Ensure user is loaded
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  // Countdown timer
  useEffect(() => {
    if (!user) return;

    const now = new Date();
    const activeCoin = user?.keys?.flatMap((key) => key.coin || []).find((coin) => {
      if (!coin.usedAt) return false;
      const usedDate = new Date(coin.usedAt);
      const expiresAt = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
      return expiresAt > now;
    });

    if (!activeCoin) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const usedDate = new Date(activeCoin.usedAt);
      const expiresAt = new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
      const diff = expiresAt - new Date();
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const unusedCoins = user?.keys?.flatMap((key) => key.coin || []).filter((c) => !c.usedAt) || [];

  if (loading || !user) return null;

  return (
    <div className="coin-cc-box">
      {timeLeft ? (
        <span className="cc-text">
          ⏳ <span className="cc-label">Coin:</span> <span className="cc-countdown">{timeLeft}</span>
        </span>
      ) : unusedCoins.length > 0 ? (
        <button
          className="cc-btn cc-btn-yellow"
          onClick={() => (window.location.href = '/redeem')}
        >
          🎟️ Redeem Coin
        </button>
      ) : (
        <button
          className="cc-btn cc-btn-blue"
          onClick={() => (window.location.href = '/payment')}
        >
          💰 Buy Coin
        </button>
      )}
    </div>
  );
};

export default CoinCountdown;
