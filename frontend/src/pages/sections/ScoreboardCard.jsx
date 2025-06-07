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

  // --- Always flatten as chars ---
  // --- Always render each ball as its own <span> ---
  let recentBalls = [];
  const balls = liveScoreboard.recentBalls;

  if (Array.isArray(balls)) {
    if (balls.length === 1 && typeof balls[0] === "string" && balls[0].includes(',')) {
      // ["4,0,2"]
      recentBalls = balls[0].split(',').slice(-6);
    } else if (balls.every(b => typeof b === "string" && b.length === 1)) {
      // ["4", "0", "2"]
      recentBalls = balls.slice(-6);
    } else if (balls.length === 1 && typeof balls[0] === "string" && balls[0].length > 1) {
      // ["004010"]
      recentBalls = balls[0].split('').slice(-6);
    } else {
      // Fallback: flatten and filter out commas
      recentBalls = balls.flatMap(str => String(str).split('')).filter(ch => ch !== ',').slice(-6);
    }
  } else if (typeof balls === "string") {
    if (balls.includes(',')) {
      // "4,0,2"
      recentBalls = balls.split(',').slice(-6);
    } else {
      // "402"
      recentBalls = balls.split('').slice(-6);
    }
  }


  // ---- Debug!
  // console.log("Debug recentBalls", recentBalls, "raw", liveScoreboard.recentBalls);

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
      {/* <div className="fancy-score-title mini">{liveScoreboard.title || ''}</div> */}
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
