import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Scoreboard.css';

// Accept socket as a prop!
const ScoreboardCard = ({ scoreboard: initialScoreboard, socket }) => {
  const [searchParams] = useSearchParams();
  const currentEventId = searchParams.get('eventId');

  const [liveScoreboard, setLiveScoreboard] = useState(initialScoreboard || {});
  const [socketConnected, setSocketConnected] = useState(socket?.connected || false);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!socket) return;

    // Connection state
    const handleConnect = () => {
      setSocketConnected(true);
      if (currentEventId) {
        socket.emit('requestScoreboardUpdate', { eventId: currentEventId });
      }
    };
    const handleDisconnect = () => setSocketConnected(false);
    const handleConnectError = (err) =>
      console.error('❌ Socket connection error:', err.message);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Scoreboard update
    const handleScoreUpdate = ({ eventId, scoreboard }) => {
      if (eventId !== currentEventId) return;
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= 1000) {
        setLiveScoreboard(scoreboard || {});
        lastUpdateTimeRef.current = now;
      }
    };

    socket.on('scoreboard_update', handleScoreUpdate);

    // Request update on mount if already connected
    if (socket.connected && currentEventId) {
      socket.emit('requestScoreboardUpdate', { eventId: currentEventId });
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('scoreboard_update', handleScoreUpdate);
    };
  }, [currentEventId, socket]);

  useEffect(() => {
    setLiveScoreboard(initialScoreboard || {});
  }, [initialScoreboard]);

  const isEmpty = !liveScoreboard || Object.keys(liveScoreboard).length === 0;
  if (isEmpty) {
    return (
      <div className="container">
        <div className="scoreboard-card text-center py-4">
          <h2 className="scoreboard-title">Live Match Scoreboard</h2>
          <p className="text-muted fs-5">⚠️ Match has not started or no live data.</p>
        </div>
      </div>
    );
  }

  // Show last 12 balls, reverse for most recent on left
  const recentBalls =
    Array.isArray(liveScoreboard.recentBalls) && liveScoreboard.recentBalls.length > 0
      ? [...liveScoreboard.recentBalls].slice(-12).reverse()
      : [];

  return (
    <div className="container">
      <div className="scoreboard-border-animate">
        <div className="scoreboard-card-neo">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge scoreboard-live-badge">{socketConnected ? '● Live' : 'Offline'}</span>
            <h2 className="scoreboard-title mb-0">{liveScoreboard.title || 'Live Scoreboard'}</h2>
          </div>

          {/* Teams and scores in one row */}
          <div className="teams-row d-flex align-items-center justify-content-between mb-3">
            <div className="team-block text-end">
              <div className="team-name">{liveScoreboard.team1 || '-'}</div>
              <div className="team-score">{liveScoreboard.score1 || '0'}<span className="slash">/</span>{liveScoreboard.wicket1 || '0'}</div>
            </div>
            <div className="vs-block fw-bold">vs</div>
            <div className="team-block text-start">
              <div className="team-name">{liveScoreboard.team2 || '-'}</div>
              <div className="team-score">{liveScoreboard.score2 || '0'}<span className="slash">/</span>{liveScoreboard.wicket2 || '0'}</div>
            </div>
          </div>

          {/* Info chips */}
          <div className="row g-2 mb-3">
            <div className="col-6 col-md-3">
              <div className="score-info-chip">
                <span>Overs</span>
                <span>
                  {Number(liveScoreboard.ballsDone1 || 0) / 6
                    ? (Number(liveScoreboard.ballsDone1) / 6).toFixed(1)
                    : '0.0'}
                  {' / '}
                  {Number(liveScoreboard.ballsDone2 || 0) / 6
                    ? (Number(liveScoreboard.ballsDone2) / 6).toFixed(1)
                    : '0.0'}
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="score-info-chip">
                <span>Target</span>
                <span>{liveScoreboard.target || '-'}</span>
              </div>
            </div>
            <div className="col-12 col-md-6 mt-2 mt-md-0">
              <div className="score-info-chip w-100">
                <span>Status</span>
                <span>{liveScoreboard.status || '-'}</span>
              </div>
            </div>
          </div>

          {/* Recent balls */}
          {recentBalls.length > 0 && (
            <div className="scoreboard-recentballs mt-3">
              <div className="mb-1 fw-bold" style={{ fontSize: '1.09rem', color: '#00ffc3' }}>
                Recent Balls:
              </div>
              <div className="recentballs-list d-flex flex-wrap gap-1">
                {recentBalls.map((ball, idx) => (
                  <span
                    key={idx}
                    className={`recent-ball${ball === 'W' ? ' wicket-ball' : ''}`}
                    title={ball === 'W' ? 'Wicket' : ''}
                  >
                    {ball}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreboardCard;
