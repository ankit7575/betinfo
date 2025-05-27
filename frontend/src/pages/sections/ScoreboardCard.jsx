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

  // Optional: color the big ball if any ball is wicket, boundary, etc.
  let ballClass = "sb-ballpill";
  if (recentBalls.includes("W")) ballClass += " wicket";
  else if (recentBalls.some(b => b === "4" || b === "6")) ballClass += " boundary";
  else if (recentBalls.some(b => ["Nb", "nb", "WD", "wd"].includes(b))) ballClass += " extra";
  else if (recentBalls.every(b => b === "0" || b === "." || b === "•")) ballClass += " dot";

  return (
    <div className="scoreboard-card-neo scoreboard-row-ultragap">
      <span className={`sb-livebadge-ultra ${socketConnected ? 'live' : ''}`}>
        {socketConnected ? '● Live' : '○ Offline'}
      </span>
      <span className="sb-title-ultra">
        {liveScoreboard.title || 'Match'}
      </span>
      <span className="sb-team-ultra">
        <span className="sb-teamname">{liveScoreboard.team1 || '-'}</span>
        <span className="sb-scorepill">{liveScoreboard.score1 || '0'}/{liveScoreboard.wicket1 || '0'}</span>
      </span>
      <span className="sb-team-ultra">
        <span className="sb-teamname">{liveScoreboard.team2 || '-'}</span>
        <span className="sb-scorepill">{liveScoreboard.score2 || '0'}/{liveScoreboard.wicket2 || '0'}</span>
      </span>
      <span className="sb-overspill">
        Ov: {overs1 || '0.0'}
      </span>
      <span className="sb-recentballs-ultra">
        <span className={ballClass} title={recentBalls.join('')}>
          {recentBalls.length ? recentBalls.join('') : '-'}
        </span>
      </span>
    </div>
  );
};

export default ScoreboardCard;
