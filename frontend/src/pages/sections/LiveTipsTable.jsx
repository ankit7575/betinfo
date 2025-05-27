import React, { useEffect, useState, useMemo } from 'react';
import { Table } from 'react-bootstrap';
import './LiveTipsTable.css';

// Helper to find tip in fallback by selectionId or runnerName
const findTipInFallback = (tip, fallbackData) =>
  fallbackData.find(f =>
    f.runnerName === tip.runnerName &&
    f.selectionId === tip.selectionId
  );

const LiveTipsTable = ({ fallbackData = [], error = null, socket, eventId, userId }) => {
  const [liveTips, setLiveTips] = useState([]);
  const [isSocketLive, setIsSocketLive] = useState(false);

  useEffect(() => {
    if (!isSocketLive && fallbackData && fallbackData.length > 0) {
      setLiveTips(
        fallbackData.map(tip => {
          const { expiresAt, ...rest } = tip;
          return { ...rest, _receivedAt: Date.now() };
        })
      );
    }
  }, [fallbackData, isSocketLive]);

  useEffect(() => {
    if (!socket || !eventId || !userId) return;
    const handleTipUpdate = (data) => {
      if (data?.eventId !== eventId || !Array.isArray(data.tips)) return;
      setIsSocketLive(true);
      setLiveTips(
        data.tips.map(tip => {
          const { expiresAt, ...rest } = tip;
          return { ...rest, _receivedAt: Date.now() };
        })
      );
    };

    socket.on('userTipsUpdate', handleTipUpdate);
    socket.emit('requestUserTipsUpdate', { eventId, userId });

    return () => {
      socket.off('userTipsUpdate', handleTipUpdate);
    };
  }, [socket, eventId, userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveTips(tips =>
        tips.filter(tip => {
          const original = findTipInFallback(tip, fallbackData) || {};
          if (original.expiresAt) {
            return new Date(original.expiresAt) > now;
          }
          return now - (tip._receivedAt || 0) < 180000;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [fallbackData]);

  const visibleColumns = useMemo(() => {
    const hasValue = getter =>
      liveTips.some(item => getter(item) !== 0);
    return {
      backOdds: hasValue(item => item.odds?.back ?? 0),
      backAmount: hasValue(item => item.Ammount?.back ?? 0),
      backProfit: hasValue(item => item.Profit?.back ?? 0),
      layOdds: hasValue(item => item.odds?.lay ?? 0),
      layAmount: hasValue(item => item.Ammount?.lay ?? 0),
      layProfit: hasValue(item => item.Profit?.lay ?? 0),
    };
  }, [liveTips]);

  const filteredTips = useMemo(
    () =>
      liveTips.filter(item =>
        (item.odds?.back && item.odds?.back !== 0) ||
        (item.odds?.lay && item.odds?.lay !== 0) ||
        (item.Ammount?.back && item.Ammount?.back !== 0) ||
        (item.Ammount?.lay && item.Ammount?.lay !== 0) ||
        (item.Profit?.back && item.Profit?.back !== 0) ||
        (item.Profit?.lay && item.Profit?.lay !== 0)
      ),
    [liveTips]
  );

  const display = val => (val === 0 ? '' : val?.toFixed(2));
  const renderError = () => (
    <tr>
      <td colSpan="7" className="text-center text-danger">{error}</td>
    </tr>
  );

  return (
    <div className='live-tips-table-wrap'>
      <div className="live-tips-header-row">
        <span>Live Betting Tips</span>
        {isSocketLive && <span className="live-dot" />}
      </div>
      <div className="live-tips-scroll">
        <Table bordered responsive className="live-tips-table">
          <thead>
            <tr>
              <th>Team</th>
              {visibleColumns.backOdds && <th>Back Odds</th>}
              {visibleColumns.backAmount && <th>Back Amount</th>}
              {visibleColumns.backProfit && <th>Back Profit</th>}
              {visibleColumns.layOdds && <th>Lay Odds</th>}
              {visibleColumns.layAmount && <th>Lay Amount</th>}
              {visibleColumns.layProfit && <th>Lay Profit</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTips.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center blackcolor">Wait for New Tip</td>
              </tr>
            ) : error === 'Access denied: Please redeem a valid coin to view match odds and investment.' ? (
              renderError()
            ) : (
              filteredTips.map((item, idx) => (
                <tr key={item.selectionId || item.runnerName || idx}>
                  <td className="Runner">{item.runnerName}</td>
                  {visibleColumns.backOdds && (
                    <td className={item.odds?.back ? 'highlight' : ''}>
                      {display(item.odds?.back ?? 0)}
                    </td>
                  )}
                  {visibleColumns.backAmount && (
                    <td className={item.Ammount?.back ? 'highlight' : ''}>
                      {display(item.Ammount?.back ?? 0)}
                    </td>
                  )}
                  {visibleColumns.backProfit && (
                    <td className={item.Profit?.back ? 'highlight' : ''}>
                      {display(item.Profit?.back ?? 0)}
                    </td>
                  )}
                  {visibleColumns.layOdds && (
                    <td className={item.odds?.lay ? 'highlight' : ''}>
                      {display(item.odds?.lay ?? 0)}
                    </td>
                  )}
                  {visibleColumns.layAmount && (
                    <td className={item.Ammount?.lay ? 'highlight' : ''}>
                      {display(item.Ammount?.lay ?? 0)}
                    </td>
                  )}
                  {visibleColumns.layProfit && (
                    <td className={item.Profit?.lay ? 'highlight' : ''}>
                      {display(item.Profit?.lay ?? 0)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LiveTipsTable;
