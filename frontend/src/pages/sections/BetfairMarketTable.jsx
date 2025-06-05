import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import './BetfairMarketTable.css';

// Accept socket as a prop!
const BetfairMarketTable = ({ matchData, handleSubmit = null, pnl = [], socket }) => {
  if (!handleSubmit) handleSubmit = () => {};
  const [searchParams] = useSearchParams();
  const currentEventId = searchParams.get('eventId') ?? matchData?.eventId;

  const [liveRunners, setLiveRunners] = useState([]);
  const [socketConnected, setSocketConnected] = useState(socket?.connected || false);
  const [highlightMap, setHighlightMap] = useState({});

  // These are used for looking up team names from selectionId
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
          const prevRunner = prev.find(p => String(p.selectionId) === String(updatedRunner.selectionId)) || {};
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

  // Helper: Get the correct team name for a selectionId
  const getRunnerName = (selectionId, fallback, index) => {
    // Prefer matchRunners.runnerId or .selectionId (string compare)
    const found = matchRunners.find(
      r =>
        String(r.selectionId ?? r.runnerId) === String(selectionId)
    );
    return found?.runnerName || fallback || `Runner ${index + 1}`;
  };

  const renderCurrentProfit = (net) => {
    if (!net || net?.length !== 2) return;
    return (
      <table>
        <tbody className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white border rounded shadow-lg p-3 z-50">
          {net?.map(item =>(<tr key={item?.selection_id} className="text-gray-700 text-sm">
            <td className='whitespace-nowrap'>
              {getRunnerName(item?.selection_id )}
            </td>
            <td>
              <div className={`whitespace-nowrap text-base ${item?.net > 0 ? 'text-green-600' : item?.net < 0 ? 'text-red-600' : '' }`}>{ item?.net || 0 } {item?.net > 0 ? '▲' : item?.net < 0 ? '▼' : '' } { item?.percentage }</div>
            </td>
          </tr>))}
        </tbody>
      </table>
    );
  };

  // Render each row in the market table
  const renderRow = (runner, index) => {
    const runnerName = getRunnerName(runner.selectionId, runner.runnerName, index);

    // Support Betfair "size" or "amount" for back/lay stakes
    const backItem = (runner.availableToBack || [])[0] || { price: 0, size: 0, amount: 0 };
    const layItem = (runner.availableToLay || [])[0] || { price: 0, size: 0, amount: 0 };
    const isBackHighlight = highlightMap[`${runner.selectionId}-back`];
    const isLayHighlight = highlightMap[`${runner.selectionId}-lay`];
    const netProfit = pnl?.find((net) => Number(net?.selection_id) === Number(runner.selectionId))
    
    return (
      <tr key={runner.selectionId || runnerName}>
        <td className="runner-name-cell">{runnerName}</td>
        <td onClick={() => handleSubmit({
          runner: runner.selectionId,
          side: 'Back',
          odd: backItem.price,
          amount: backItem.amount,
        })} className={`relative group cell-odds cell-back ${isBackHighlight ? 'highlight' : ''}`}>
          {renderCurrentProfit(backItem?.net)}
          <div className="pending-odds">{backItem.price}</div>
          <div className="pending-stake">{backItem.amount}</div>
        </td>
        <td onClick={() => handleSubmit({
          runner: runner.selectionId,
          side: 'Lay',
          odd: layItem.price,
          amount: layItem.amount,
        })} className={`relative group cell-odds cell-lay ${isLayHighlight ? 'highlight' : ''}`}>
          {renderCurrentProfit(layItem?.net)}
          <div className="pending-odds">{layItem.price}</div>
          <div className="pending-stake">{layItem.amount}</div>
        </td>
        <td className={`gap-2 text-center`}>
            <span className={`text-base ${netProfit?.net > 0 ? 'text-green-600' : netProfit?.net < 0 ? 'text-red-600' : 'text-white' }`}>{ netProfit?.net || 0 } {netProfit?.net > 0 ? '▲' : netProfit?.net < 0 ? '▼' : '' }</span>
            <span className={`ml-2 text-base ${netProfit?.net > 0 ? 'text-green-600' : netProfit?.net < 0 ? 'text-red-600' : 'text-white' }`}>{ netProfit?.percentage }</span>
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
            <th>Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {liveRunners.length > 0 ? liveRunners.map(renderRow) : (
            <tr>
              <td colSpan="4" className="text-center">No runner data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BetfairMarketTable;
