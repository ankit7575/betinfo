import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const LatestTips = () => {
  const [oddsHistory, setOddsHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io('http://localhost:4000'); // Change to your backend WebSocket URL

    // Listen for updates from the server
    socket.on('oddsUpdate', (data) => {
      setOddsHistory(data.oddsHistory);
      setError(data.error || null);
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2 className="fw-bold">Latest Tip</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table bordered hover className="table-striped align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th className="Runner">Runner</th>
              <th className="Odds1">Back Odds</th>
              <th className="Odds2">Lay Odds</th>
              <th className="Amount1">Back Amount</th>
              <th className="Amount2">Lay Amount</th>
              <th className="Profit1">Back Profit</th>
              <th className="Profit2">Lay Profit</th>
            </tr>
          </thead>
          <tbody>
            {oddsHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No latest odds available.
                </td>
              </tr>
            ) : error === 'Access denied: Please redeem a valid coin to view match odds and investment.' ? (
              renderError()
            ) : (
              oddsHistory.map((item, idx) => (
                <tr key={idx}>
                  <td className="Runner">{item.runnerName}</td>
                  <td className={item.odds?.back ? 'Odds1' : ''}>{item.odds?.back ?? 0}</td>
                  <td className={item.odds?.lay ? 'Odds2' : ''}>{item.odds?.lay ?? 0}</td>
                  <td className={item.Ammount?.back ? 'Amount1' : ''}>{item.Ammount?.back ?? 0}</td>
                  <td className={item.Ammount?.lay ? 'Amount2' : ''}>{item.Ammount?.lay ?? 0}</td>
                  <td className={item.Profit?.back ? 'Profit1' : ''}>{item.Profit?.back ?? 0}</td>
                  <td className={item.Profit?.lay ? 'Profit2' : ''}>{item.Profit?.lay ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LatestTips;