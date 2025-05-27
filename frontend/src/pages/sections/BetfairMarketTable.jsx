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
    const backItem = (runner.availableToBack || [])[0] || { price: 0, size: 0 };
    const layItem = (runner.availableToLay || [])[0] || { price: 0, size: 0 };
    const isBackHighlight = highlightMap[`${runner.selectionId}-back`];
    const isLayHighlight = highlightMap[`${runner.selectionId}-lay`];

    return (
      <tr key={runner.selectionId || runnerName}>
        <td className="runner-name-cell">{runnerName}</td>
        <td className={`cell-odds cell-back ${isBackHighlight ? 'highlight' : ''}`}>
          <div className="pending-odds">{backItem.price}</div>
          <div className="pending-stake">{backItem.size}</div>
        </td>
        <td className={`cell-odds cell-lay ${isLayHighlight ? 'highlight' : ''}`}>
          <div className="pending-odds">{layItem.price}</div>
          <div className="pending-stake">{layItem.size}</div>
        </td>
      </tr>
    );
  };

  return (
    <div className="market-table-compact">
      <div className="market-header-compact">
        <span>Match Odds</span>
        {socketConnected && <span className="live-dot" />}
      </div>
      <table className="market-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Back</th>
            <th>Lay</th>
          </tr>
        </thead>
        <tbody>
          {liveRunners.length > 0 ? liveRunners.map(renderRow) : (
            <tr>
              <td colSpan="3" className="text-center">No runner data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BetfairMarketTable;
