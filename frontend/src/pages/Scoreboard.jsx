import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './Scoreboard.css';

const ScoreboardCard = ({ scoreboard: initialScoreboard }) => {
  const [liveScoreboard, setLiveScoreboard] = useState(initialScoreboard || {});
  const socketRef = useRef(null);
  const lastUpdateTimeRef = useRef(0); // track last update time

  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
      });
    }

    const socket = socketRef.current;

    // Listen for scoreboard updates, throttled to 1 second
    const handleScoreUpdate = ({ eventId, scoreboard }) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

      if (timeSinceLastUpdate >= 1000) {
        console.log(`📢 Scoreboard update received for event ${eventId}`);
        setLiveScoreboard(scoreboard || {});
        lastUpdateTimeRef.current = now;
      }
    };

    socket.on('scoreboard_update', handleScoreUpdate);

    return () => {
      socket.off('scoreboard_update', handleScoreUpdate);
      setLiveScoreboard(initialScoreboard || {});
    };
  }, [initialScoreboard]);

  const isScoreboardEmpty = !liveScoreboard || Object.keys(liveScoreboard).length === 0;

  if (isScoreboardEmpty) {
    return (
      <div className="container">
        <div className="scoreboard-card text-center py-4">
          <h2 className="scoreboard-title">Live Match Scoreboard</h2>
          <p className="text-muted fs-5">⚠️ Match has not started yet or no live data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="scoreboard-card">
        <h2 className="scoreboard-title">
          {liveScoreboard.title || 'Live Match Scoreboard'}
        </h2>

        <table className="scoreboard-table">
          <thead>
            <tr>
              <th>Info</th>
              <th>{liveScoreboard.t1 || '-'}</th>
              <th>{liveScoreboard.t2 || '-'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Teams</td>
              <td>{liveScoreboard.team1 || '-'}</td>
              <td>{liveScoreboard.team2 || '-'}</td>
            </tr>
            <tr>
              <td>Scoreboard</td>
              <td>{liveScoreboard.score1 || '0'} / {liveScoreboard.wicket1 || '0'}</td>
              <td>{liveScoreboard.score2 || '0'} / {liveScoreboard.wicket2 || '0'}</td>
            </tr>
            <tr>
              <td>Overs</td>
              <td>{((liveScoreboard.ballsDone1 || 0) / 6).toFixed(1)}</td>
              <td>{((liveScoreboard.ballsDone2 || 0) / 6).toFixed(1)}</td>
            </tr>
          </tbody>
        </table>

        <div className="scoreboard-details">
          <p><strong>Target:</strong> {liveScoreboard.target || '-'}</p>
          <p><strong>Match Status:</strong> {liveScoreboard.status || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardCard;
