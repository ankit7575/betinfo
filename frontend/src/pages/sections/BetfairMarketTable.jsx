import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import './BetfairMarketTable.css';

// Accept socket as a prop!
const BetfairMarketTable = ({ matchData, socket }) => {
  const [searchParams] = useSearchParams();
  const currentEventId = searchParams.get('eventId');

  const [liveRunners, setLiveRunners] = useState([]);
  const [socketConnected, setSocketConnected] = useState(socket?.connected || false);
  const [highlightMap, setHighlightMap] = useState({});

  const initialRunners = useMemo(() => matchData?.market?.runners || [], [matchData]);
  const matchRunners = useMemo(() => matchData?.matchRunners || [], [matchData]);

  useEffect(() => {
    setLiveRunners(initialRunners);
  }, [initialRunners]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const handleOddsUpdate = (data) => {
      if (data?.eventId !== currentEventId || !data?.odds?.runners) return;

      const updated = data.odds.runners;
      const newHighlights = {};

      setLiveRunners(prev =>
        updated.map((updatedRunner) => {
          const prevRunner = prev.find(p => p.selectionId === updatedRunner.selectionId) || {};
          const newBack = updatedRunner.availableToBack?.[0]?.price;
          const newLay = updatedRunner.availableToLay?.[0]?.price;
          const oldBack = prevRunner.availableToBack?.[0]?.price;
          const oldLay = prevRunner.availableToLay?.[0]?.price;

          if (newBack !== oldBack) newHighlights[`${updatedRunner.selectionId}-back`] = true;
          if (newLay !== oldLay) newHighlights[`${updatedRunner.selectionId}-lay`] = true;

          return { ...prevRunner, ...updatedRunner };
        })
      );

      setHighlightMap(newHighlights);
      setTimeout(() => setHighlightMap({}), 500);
    };

    socket.on('betfair_odds_update', handleOddsUpdate);

    const interval = setInterval(() => {
      if (socketConnected && currentEventId) {
        socket.emit('requestOddsUpdate', { eventId: currentEventId });
      }
    }, 500);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('betfair_odds_update', handleOddsUpdate);
      clearInterval(interval);
    };
  }, [currentEventId, socketConnected, socket]);

  const getRunnerName = (selectionId, fallback, index) => {
    const match = matchRunners.find(r => String(r.selectionId) === String(selectionId));
    return match?.runnerName || fallback || `Runner ${index + 1}`;
  };

  const renderRow = (runner, index) => {
    const runnerName = getRunnerName(runner.selectionId, runner.runnerName, index);
    const backData = (runner.availableToBack || []).slice(0, 3).reverse(); // REVERSED BACK
    const layData = (runner.availableToLay || []).slice(0, 3); // NORMAL

    return (
      <tr key={runner.selectionId || runnerName}>
        <td className="runner-name-cell">{runnerName}</td>

        {/* Back (Reversed) */}
        {backData.map((item, i) => {
          const isHighlight = highlightMap[`${runner.selectionId}-back`] && i === 2;
          return (
            <td key={`b-${i}`} className={`cell-odds cell-back ${isHighlight ? 'highlight' : ''}`}>
              <div className="pending-odds">{item.price || 0}</div>
              <div className="pending-stake">{item.size || 0}</div>
            </td>
          );
        })}
        {[...Array(3 - backData.length)].map((_, i) => (
          <td key={`b-empty-${i}`} className="cell-odds cell-back">
            <div className="pending-odds">0</div>
            <div className="pending-stake">0</div>
          </td>
        ))}

        {/* Lay (Unchanged) */}
        {layData.map((item, i) => {
          const isHighlight = highlightMap[`${runner.selectionId}-lay`] && i === 0;
          return (
            <td key={`l-${i}`} className={`cell-odds cell-lay ${isHighlight ? 'highlight' : ''}`}>
              <div className="pending-odds">{item.price || 0}</div>
              <div className="pending-stake">{item.size || 0}</div>
            </td>
          );
        })}
        {[...Array(3 - layData.length)].map((_, i) => (
          <td key={`l-empty-${i}`} className="cell-odds cell-lay">
            <div className="pending-odds">0</div>
            <div className="pending-stake">0</div>
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="container pb-5">
      <div className="market-header d-flex justify-content-between align-items-center mb-2">
        <div>
          <h2>Match Odds</h2>
          <span>{liveRunners.length} selections</span>
        </div>
        <div className="socket-status">
          {socketConnected && <span className="badge bg-success px-3 py-1">Live</span>}
        </div>
      </div>
      <table className="market-table">
        <thead>
          <tr>
            <th>Team</th>
            <th colSpan="3">Back</th>
            <th colSpan="3">Lay</th>
          </tr>
        </thead>
        <tbody>
          {liveRunners.length > 0 ? liveRunners.map(renderRow) : (
            <tr>
              <td colSpan="7" className="text-center">No runner data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BetfairMarketTable;
