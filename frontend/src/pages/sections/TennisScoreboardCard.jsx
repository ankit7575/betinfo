import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Scoreboard.css'; // Reuse your mini scoreboard styles

const TennisScoreboardCard = ({ scoreboard: initialScoreboard, socket }) => {
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

  // Example: structure expected for tennis scoreboard
  // liveScoreboard = {
  //   title: "Wimbledon Final",
  //   player1: "Player A",
  //   player2: "Player B",
  //   setScores1: [6, 4, 3], // Each set
  //   setScores2: [3, 6, 6],
  //   currentSet: 3,
  //   currentGameScore1: 30, // 0/15/30/40/Ad
  //   currentGameScore2: 40,
  //   server: 1, // 1 or 2, who is serving
  //   isTB: false, // tiebreak
  //   ...etc.
  // }

  // For more flexible rendering:
  const { player1, player2, setScores1 = [], setScores2 = [], currentSet, currentGameScore1, currentGameScore2, server, isTB } = liveScoreboard;

  return (
    <div className="fancy-card-scoreboard mini tennis">
      <div className="fancy-scoreboard-header mini">
        <div className={socketConnected ? "fancy-live-dot" : "fancy-offline-dot"} />
        <span className="fancy-live-text mini">{socketConnected ? "LIVE" : "OFF"}</span>
      </div>
      <div className="fancy-score-title mini">{liveScoreboard.title || ''}</div>

      <div className="fancy-score-teams mini tennis">
        {/* Player 1 Row */}
        <span className="fancy-teamname">
          {player1 || '-'}
          {server === 1 && <span className="tennis-serve-dot" title="Serving">●</span>}
        </span>
        {/* Set Scores */}
        <span className="fancy-score tennis-sets">
          {setScores1.length
            ? setScores1.map((score, i) => (
                <span key={i} className={`tennis-set-score ${currentSet === i + 1 ? 'current-set' : ''}`}>
                  {score}
                </span>
              ))
            : <span>-</span>}
        </span>
        {/* Current Game Score */}
        <span className="tennis-game-score">
          {typeof currentGameScore1 !== 'undefined' ? currentGameScore1 : '-'}
        </span>
      </div>

      <div className="fancy-score-teams mini tennis">
        {/* Player 2 Row */}
        <span className="fancy-teamname">
          {player2 || '-'}
          {server === 2 && <span className="tennis-serve-dot" title="Serving">●</span>}
        </span>
        {/* Set Scores */}
        <span className="fancy-score tennis-sets">
          {setScores2.length
            ? setScores2.map((score, i) => (
                <span key={i} className={`tennis-set-score ${currentSet === i + 1 ? 'current-set' : ''}`}>
                  {score}
                </span>
              ))
            : <span>-</span>}
        </span>
        {/* Current Game Score */}
        <span className="tennis-game-score">
          {typeof currentGameScore2 !== 'undefined' ? currentGameScore2 : '-'}
        </span>
      </div>

      <div className="tennis-current-set-label mini">
        Set: <b>{currentSet || '-'}</b> {isTB ? <span className="tennis-tb">TB</span> : null}
      </div>
    </div>
  );
};

export default TennisScoreboardCard;
