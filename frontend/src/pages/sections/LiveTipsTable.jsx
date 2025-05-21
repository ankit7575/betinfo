import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './LiveTipsTable.css';

const LiveTipsTable = ({ socket, userId, eventId }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [oddsData, setOddsData] = useState([]);
  const [error, setError] = useState(null);

  // 👉 Initial socket setup
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('✅ Socket connected (LiveTipsTable)');
      setSocketConnected(true);

      if (userId && eventId) {
        socket.emit('requestOddsUpdate', { eventId, userId });
      }
    };

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected (LiveTipsTable)');
      setSocketConnected(false);
    };

    const handleOddsUpdate = (data) => {
      if (data?.eventId !== eventId) return;

      if (!data?.success) {
        setError(data?.message || "Failed to fetch odds.");
        setOddsData([]);
        return;
      }

      setOddsData(data.oddsHistory || []);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('oddsUpdated', handleOddsUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('oddsUpdated', handleOddsUpdate);
    };
  }, [socket, userId, eventId]);

  // 🔁 Re-emit if socket is already connected later
  useEffect(() => {
    if (socket && socketConnected && userId && eventId) {
      socket.emit('requestOddsUpdate', { eventId, userId });
    }
  }, [socket, socketConnected, userId, eventId]);

  const renderError = () => (
    <tr>
      <td colSpan="7" className="text-center text-danger">{error}</td>
    </tr>
  );

  return (
    <div className='pb-5'>
      <div className="live-tips-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="fw-bold text-white">Live Betting Tips</h2>
            {socketConnected && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '8px',
                backgroundColor: '#28a745',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                Live
              </span>
            )}
          </div>

          <div className="live-tips-scroll">
            <Table bordered hover responsive className="table-striped align-middle shadow-sm live-tips-table">
              <thead className="table-dark">
                <tr>
                  <th>Runner</th>
                  <th>Back Odds</th>
                  <th>Back Amount</th>
                  <th>Back Profit</th>
                  <th>Lay Odds</th>
                  <th>Lay Amount</th>
                  <th>Lay Profit</th>
                </tr>
              </thead>
              <tbody>
                {oddsData.length === 0 && !error ? (
                  <tr>
                    <td colSpan="7" className="text-center blackcolor">
                      No latest odds available.
                    </td>
                  </tr>
                ) : error ? (
                  renderError()
                ) : (
                  oddsData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.runnerName}</td>
                      <td>{item.odds?.back ?? 0}</td>
                      <td>{item.Ammount?.back ?? 0}</td>
                      <td>{item.Profit?.back ?? 0}</td>
                      <td>{item.odds?.lay ?? 0}</td>
                      <td>{item.Ammount?.lay ?? 0}</td>
                      <td>{item.Profit?.lay ?? 0}</td>
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
