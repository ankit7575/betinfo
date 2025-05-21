import React from 'react';
import { Table } from 'react-bootstrap';

const OddsHistoryTable = ({ oddsHistory }) => {
  // Function to format the timestamp to a human-readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format the date and time as per your requirement
  };

  // Function to flatten and alternate the teams' history
  const getInterleavedHistory = () => {
    const interleaved = [];
    
    // Find the maximum number of histories between all teams
    const maxLength = Math.max(...oddsHistory.map(item => item.history.length));

    for (let i = 0; i < maxLength; i++) {
      oddsHistory.forEach((item) => {
        if (item.history[i]) {
          interleaved.push({
            runnerName: item.runnerName,
            historyItem: item.history[i]
          });
        }
      });
    }

    return interleaved;
  };

  // Interleave the history and then sort by timestamp in descending order
  const interleavedHistory = getInterleavedHistory().sort((a, b) => new Date(b.historyItem.timestamp) - new Date(a.historyItem.timestamp));

  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Table bordered hover className="table-striped align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Runner</th>
            <th>Timestamp</th>
            <th>Back Odds</th>
            <th>Lay Odds</th>
            <th>Back Amount</th>
            <th>Lay Amount</th>
            <th>Back Profit</th>
            <th>Lay Profit</th>
          </tr>
        </thead>
        <tbody>
          {interleavedHistory.map((item, idx) => (
            <tr key={idx}>
              <td>{item.runnerName}</td>
              <td>{formatTime(item.historyItem.timestamp)}</td>
              <td>{item.historyItem.odds?.back ?? 0}</td>
              <td>{item.historyItem.odds?.lay ?? 0}</td>
              <td>{item.historyItem.Ammount?.back ?? 0}</td>
              <td>{item.historyItem.Ammount?.lay ?? 0}</td>
              <td>{item.historyItem.Profit?.back ?? 0}</td>
              <td>{item.historyItem.Profit?.lay ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OddsHistoryTable;
