import React, { useEffect, useState, useRef } from "react";
import "./SoccerScoreboardCard.css";

/**
 * Props:
 *  - scoreboard: {
 *      title, team1, team2, score1, score2, time, status, eventName, period, recentEvents
 *    }
 *  - socket: socket.io instance (optional, for live data)
 */
const SoccerScoreboardCard = ({ scoreboard: initialScoreboard, socket }) => {
  const [liveScoreboard, setLiveScoreboard] = useState(initialScoreboard || {});
  const [socketConnected, setSocketConnected] = useState(socket?.connected || false);
  const lastUpdateTimeRef = useRef(0);

  // Socket live update
  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    const handleScoreUpdate = ({ eventId, scoreboard }) => {
      // If eventId logic needed, add here
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= 1000) {
        setLiveScoreboard(scoreboard || {});
        lastUpdateTimeRef.current = now;
      }
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("soccer_scoreboard_update", handleScoreUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("soccer_scoreboard_update", handleScoreUpdate);
    };
  }, [socket]);

  useEffect(() => {
    setLiveScoreboard(initialScoreboard || {});
  }, [initialScoreboard]);

  // Recent events/goals display (optional)
  const recentEvents = Array.isArray(liveScoreboard.recentEvents)
    ? [...liveScoreboard.recentEvents].slice(-5)
    : [];

  return (
    <div className="soccer-scoreboard-card">
      <div className="ssc-header">
        <div className={socketConnected ? "ssc-live-dot" : "ssc-offline-dot"} />
        <span className="ssc-live-text">{socketConnected ? "LIVE" : "OFFLINE"}</span>
        <span className="ssc-match-time">{liveScoreboard.time || "00:00"}</span>
      </div>
      <div className="ssc-title">{liveScoreboard.title || liveScoreboard.eventName || "Soccer Match"}</div>
      <div className="ssc-teams-row">
        <span className="ssc-team">{liveScoreboard.team1 || "-"}</span>
        <span className="ssc-score">{liveScoreboard.score1 ?? "0"}</span>
        <span className="ssc-divider">-</span>
        <span className="ssc-score">{liveScoreboard.score2 ?? "0"}</span>
        <span className="ssc-team">{liveScoreboard.team2 || "-"}</span>
      </div>
      <div className="ssc-period">{liveScoreboard.period || liveScoreboard.status || "1st Half"}</div>
      {recentEvents.length > 0 && (
        <div className="ssc-recent-events">
          <span className="ssc-label">Last Events:</span>
          {recentEvents.map((evt, idx) => (
            <span key={idx} className="ssc-event">{evt}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoccerScoreboardCard;
