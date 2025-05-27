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

  // --- Use fallbackData as backup, and to set initial tips ---
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

  // --- Listen for Socket.IO tip updates ---
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

    // Listen for custom socket event
    socket.on('userTipsUpdate', handleTipUpdate);

    // Optionally, request tips update immediately
    socket.emit('requestUserTipsUpdate', { eventId, userId });

    // Clean up on unmount
    return () => {
      socket.off('userTipsUpdate', handleTipUpdate);
    };
  }, [socket, eventId, userId]);

  // --- Remove expired tips every 3 seconds ---
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

  // --- Column visibility logic as before ---
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

  // --- Filter out empty tips ---
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
    <div className=''>
      <div className="live-tips-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="fw-bold text-white">Live Betting Tips</h2>
            {isSocketLive && <span className="badge bg-success">Live</span>}
          </div>
          <div className="live-tips-scroll">
            <Table bordered hover responsive className="table-striped align-middle shadow-sm live-tips-table">
              <thead className="table-dark">
                <tr>
                  <th className="Runner">Team</th>
                  {visibleColumns.backOdds && <th className="Odds1">Back Odds</th>}
                  {visibleColumns.backAmount && <th className="Amount1">Back Amount</th>}
                  {visibleColumns.backProfit && <th className="Profit1">Back Profit</th>}
                  {visibleColumns.layOdds && <th className="Odds2">Lay Odds</th>}
                  {visibleColumns.layAmount && <th className="Amount2">Lay Amount</th>}
                  {visibleColumns.layProfit && <th className="Profit2">Lay Profit</th>}
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
                    <tr key={item.selectionId || item.runnerName || idx} className="live-tip-row">
                      <td className="Runner">{item.runnerName}</td>
                      {visibleColumns.backOdds && (
                        <td className={item.odds?.back ? 'Odds1 highlight' : 'Odds1'}>
                          {display(item.odds?.back ?? 0)}
                        </td>
                      )}
                      {visibleColumns.backAmount && (
                        <td className={item.Ammount?.back ? 'Amount1 highlight' : 'Amount1'}>
                          {display(item.Ammount?.back ?? 0)}
                        </td>
                      )}
                      {visibleColumns.backProfit && (
                        <td className={item.Profit?.back ? 'Profit1 highlight' : 'Profit1'}>
                          {display(item.Profit?.back ?? 0)}
                        </td>
                      )}
                      {visibleColumns.layOdds && (
                        <td className={item.odds?.lay ? 'Odds2 highlight' : 'Odds2'}>
                          {display(item.odds?.lay ?? 0)}
                        </td>
                      )}
                      {visibleColumns.layAmount && (
                        <td className={item.Ammount?.lay ? 'Amount2 highlight' : 'Amount2'}>
                          {display(item.Ammount?.lay ?? 0)}
                        </td>
                      )}
                      {visibleColumns.layProfit && (
                        <td className={item.Profit?.lay ? 'Profit2 highlight' : 'Profit2'}>
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
      </div>
    </div>
  );
};

export default LiveTipsTable;
