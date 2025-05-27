import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Scoreboard.css';

const ScoreboardCard = ({ scoreboard: initialScoreboard, socket }) => {
  const [searchParams] = useSearchParams();
  const currentEventId = searchParams.get('eventId');
  const [liveScoreboard, setLiveScoreboard] = useState(initialScoreboard || {});
  const [socketConnected, setSocketConnected] = useState(socket?.connected || false);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => {
      setSocketConnected(true);
      if (currentEventId) socket.emit('requestScoreboardUpdate', { eventId: currentEventId });
    };
    const handleDisconnect = () => setSocketConnected(false);
    const handleScoreUpdate = ({ eventId, scoreboard }) => {
      if (eventId !== currentEventId) return;
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= 1000) {
        setLiveScoreboard(scoreboard || {});
        lastUpdateTimeRef.current = now;
      }
    };
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('scoreboard_update', handleScoreUpdate);
    if (socket.connected && currentEventId) socket.emit('requestScoreboardUpdate', { eventId: currentEventId });
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('scoreboard_update', handleScoreUpdate);
    };
  }, [currentEventId, socket]);

  useEffect(() => {
    setLiveScoreboard(initialScoreboard || {});
  }, [initialScoreboard]);

  // Last 6 balls, left = oldest
  const recentBalls =
    Array.isArray(liveScoreboard.recentBalls) && liveScoreboard.recentBalls.length > 0
      ? [...liveScoreboard.recentBalls].slice(-6)
      : [];

  const overs1 = (Number(liveScoreboard.ballsDone1 || 0) / 6).toFixed(1);

  const getBallClass = (b) => {
    if (["W", "w"].includes(b)) return "fancy-scoreboard-ball wicket";
    if (b === "4") return "fancy-scoreboard-ball four";
    if (b === "6") return "fancy-scoreboard-ball six";
    if (["Nb", "nb", "WD", "wd"].includes(b)) return "fancy-scoreboard-ball extra";
    if (["0", ".", "•"].includes(b)) return "fancy-scoreboard-ball dot";
    return "fancy-scoreboard-ball";
  };

  return (
    <div className="fancy-card-scoreboard mini">
      <div className="fancy-scoreboard-header mini">
        <div className={socketConnected ? "fancy-live-dot" : "fancy-offline-dot"} />
        <span className="fancy-live-text mini">{socketConnected ? "LIVE" : "OFF"}</span>
      </div>
      <div className="fancy-score-title mini">{liveScoreboard.title || ''}</div>
      <div className="fancy-score-teams mini">
        <span className="fancy-teamname">{liveScoreboard.team1 || '-'}</span>
        <span className="fancy-score">
          {liveScoreboard.score1 || '0'}
          <span className="fancy-divider">/</span>
          {liveScoreboard.wicket1 || '0'}
        </span>
        <span style={{marginLeft:8}} className="fancy-overs">{overs1 || '0.0'}</span>
      </div>
      <div className="fancy-score-teams mini">
        <span className="fancy-teamname">{liveScoreboard.team2 || '-'}</span>
        <span className="fancy-score">
          {liveScoreboard.score2 || '0'}
          <span className="fancy-divider">/</span>
          {liveScoreboard.wicket2 || '0'}
        </span>
      </div>
      <div className="fancy-balls-row mini">
        {recentBalls.length
          ? recentBalls.map((b, i) => (
              <span key={i} className={getBallClass(b)}>{b}</span>
            ))
          : <span className="fancy-noballs">-</span>
        }
      </div>
    </div>
  );
};

export default ScoreboardCard;
