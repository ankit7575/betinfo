import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { calculateUserOdds } from '../../utils/calculateUserOdds';
import './TipHistoryTable.css';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const TipHistoryTable = ({
  adminBetfairOdds = [],
  userOwnOdds,
  adminOpeningBalance = 200000,
  userOpeningBalance = 0,
  userId = '',
  eventId,
  setLatestTip,
  socket // <<--- Receive from parent
}) => {
  const [flatRows, setFlatRows] = useState([]);

  // Flatten all bets to one row per Back/Lay action
  const flattenHistory = useCallback((oddsSource, userOdds) => {
    const flat = [];
    let serial = 1;
    oddsSource.forEach((tip) => {
      const { runnerName = '-', layingHistory = [], selectionId } = tip;
      layingHistory.forEach((entry) => {
        const adminOdds = {
          selectionId,
          runnerName,
          odds: entry.odds || {},
          Ammount: entry.Ammount || {},
          Profit: entry.Profit || {},
        };
        const userCalculated = calculateUserOdds(adminOdds, adminOpeningBalance, userOpeningBalance, userId);

        // Lay
        if (userCalculated.odds.lay && userCalculated.odds.lay !== 0 && userCalculated.Ammount.lay && userCalculated.Ammount.lay !== 0) {
          flat.push({
            serial,
            datetime: formatTime(entry.timestamp),
            runnerName,
            side: "Lay",
            rate: userCalculated.odds.lay,
            amount: userCalculated.Ammount.lay,
            timestamp: entry.timestamp,
            owner: 'admin',
          });
          serial++;
        }
        // Back
        if (userCalculated.odds.back && userCalculated.odds.back !== 0 && userCalculated.Ammount.back && userCalculated.Ammount.back !== 0) {
          flat.push({
            serial,
            datetime: formatTime(entry.timestamp),
            runnerName,
            side: "Back",
            rate: userCalculated.odds.back,
            amount: userCalculated.Ammount.back,
            timestamp: entry.timestamp,
            owner: 'admin',
          });
          serial++;
        }
      });
    });
    userOdds?.forEach((tip) => {
      const { runnerName = '-', layingHistory = [], selectionId } = tip;
      layingHistory.forEach((entry) => {
        const adminOdds = {
          selectionId,
          runnerName,
          odds: entry.odds || {},
          Ammount: entry.Ammount || {},
          Profit: entry.Profit || {},
        };
        const userCalculated = calculateUserOdds(adminOdds, 1, 1, userId);

        // Lay
        if (userCalculated.odds.lay && userCalculated.odds.lay !== 0 && userCalculated.Ammount.lay && userCalculated.Ammount.lay !== 0) {
          flat.push({
            serial,
            datetime: formatTime(entry.timestamp),
            runnerName,
            side: "Lay",
            rate: userCalculated.odds.lay,
            amount: userCalculated.Ammount.lay,
            timestamp: entry.timestamp,
            owner: 'user',
          });
          serial++;
        }
        // Back
        if (userCalculated.odds.back && userCalculated.odds.back !== 0 && userCalculated.Ammount.back && userCalculated.Ammount.back !== 0) {
          flat.push({
            serial,
            datetime: formatTime(entry.timestamp),
            runnerName,
            side: "Back",
            rate: userCalculated.odds.back,
            amount: userCalculated.Ammount.back,
            timestamp: entry.timestamp,
            owner: 'user',
          });
          serial++;
        }
      });
    });
    // Sort by timestamp DESC
    return flat.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [adminOpeningBalance, userOpeningBalance, userId]);

  useEffect(() => {
    const updated = flattenHistory(adminBetfairOdds, userOwnOdds?.runners);
    setFlatRows(updated);
    if (setLatestTip){
      for (const tip of updated) {
        if (tip.owner === 'admin') {
          setLatestTip(tip);
          break;
        }
      }
    }
  }, [adminBetfairOdds, setLatestTip, userOwnOdds, flattenHistory]);

  useEffect(() => {
    if (!socket) return;
    const handleTipUpdate = (data) => {
      if (data?.layingHistory && data?.eventId === eventId) {
        if (setLatestTip){
          setLatestTip({
            runnerName: data.layingHistory.runnerName,
            side: data.layingHistory.side,
            rate: data.layingHistory.odd,
            amount: data.layingHistory.amount,
          });
        }
        setFlatRows(prev => [{
            datetime: formatTime(data.layingHistory.timestamp),
            runnerName: data.layingHistory.runnerName,
            side: data.layingHistory.side,
            rate: data.layingHistory.odd,
            amount: data.layingHistory.amount,
            timestamp: data.layingHistory.timestamp
          }, ...prev]);
      }
    };
    socket.on('admin_tip_update', handleTipUpdate);
    return () => socket.off('admin_tip_update', handleTipUpdate);
  }, [flattenHistory, setLatestTip, eventId, socket]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="fw-bold">Tips History</h2>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Table bordered hover responsive className="table-striped align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>S. No.</th>
                <th>Date &amp; Time</th>
                <th>Runner</th>
                <th>Side</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {flatRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No Tips history available.</td>
                </tr>
              ) : (
                flatRows.map((row, idx) => (
                  <tr key={row.serial + '-' + row.timestamp + '-' + row.side}>
                    <td>{idx + 1}</td>
                    <td>{row.datetime}</td>
                    <td>{row.runnerName}</td>
                    <td>{row.side}</td>
                    <td>{row.rate}</td>
                    <td>{row.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TipHistoryTable;
