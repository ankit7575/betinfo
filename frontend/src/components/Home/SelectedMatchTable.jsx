import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import './TipTable.css';

const SelectedMatchTable = ({ matches = [], user, now = new Date() }) => {
  const navigate = useNavigate(); // <-- Use the hook

  // All user's not-expired, used coins
  const allCoins = (user?.keys || []).flatMap(key => key.coin || []);
  const validEventIds = allCoins
    .filter(
      (coin) =>
        coin.usedForEventId &&
        coin.expiresAt &&
        new Date(coin.expiresAt) > now
    )
    .map((coin) => coin.usedForEventId?.toString());

  // Only matches the user has redeemed a valid coin for
  const selectedMatches = matches.filter(
    (match) =>
      match.selected &&
      Array.isArray(match.matchRunners) &&
      match.matchRunners.length === 2 &&
      Array.isArray(match.markets) &&
      match.markets.length > 0 &&
      match.openDate &&
      !isNaN(new Date(match.openDate)) &&
      validEventIds.includes(match.eventId?.toString())
  );

  const formatMatchTime = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMatchDate = (openDate) => {
    const d = new Date(openDate);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  };

  // Use navigate instead of window.open
  const handleViewTip = (eventId, markets) => {
    const matchOddsMarket = markets?.find((m) => m.marketName === 'Match Odds');
    const matchOddsMarketId = matchOddsMarket?.marketId || '';
    navigate(`/viewtip?eventId=${eventId}&marketId=${matchOddsMarketId}`);
  };

  if (!selectedMatches.length) {
    return (
      <div className="white" style={{ padding: "24px 0", fontSize: '1.07rem', textAlign: 'center', opacity: 0.7 }}>
        No selected/redeemed matches found.
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="match-day-title mb-3">
        <span className="badge bg-success text-light" style={{ fontSize: '1.13rem', padding: '7px 24px', borderRadius: '16px', letterSpacing: 1 }}>
          YOUR REDEEMED MATCHES
        </span>
      </div>
      {/* Desktop Table */}
      <div className="table-responsive soccer-table-desktop">
        <table className="table table-bordered table-hover glow-border">
          <thead className="table-dark">
            <tr>
              <th>Teams</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Competition</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedMatches.map((match, index) => {
              const teamNames =
                match.eventName ||
                (Array.isArray(match.matchRunners)
                  ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                  : 'N/A');
              const eventId = match.eventId;
              const matchDateObj = new Date(match.openDate);
              const isLive = matchDateObj <= now;
              return (
                <tr key={eventId || index}>
                  <td>{teamNames}</td>
                  <td>{formatMatchDate(match.openDate)}</td>
                  <td>{formatMatchTime(match.openDate)}</td>
                  <td>
                    {isLive ? (
                      <span className="badge bg-success">Live</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Upcoming</span>
                    )}
                  </td>
                  <td>{match.competitionName || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-success view-tip"
                      onClick={() => handleViewTip(eventId, match.markets)}
                    >
                      View Tip
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Version: Cards */}
      <div className="soccer-table-mobile">
        {selectedMatches.map((match, index) => {
          const teamNames =
            match.eventName ||
            (Array.isArray(match.matchRunners)
              ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
              : 'N/A');
          const eventId = match.eventId;
          const matchDateObj = new Date(match.openDate);
          const isLive = matchDateObj <= now;
          return (
            <div className="soccer-card" key={eventId || index}>
              <div className="soccer-card-header">
                <span className="soccer-teams">{teamNames}</span>
                <span className="soccer-competition">{match.competitionName || 'N/A'}</span>
              </div>
              <div className="soccer-card-row">
                <span className="soccer-label">Date:</span>
                <span>{formatMatchDate(match.openDate)}</span>
              </div>
              <div className="soccer-card-row">
                <span className="soccer-label">Time:</span>
                <span>{formatMatchTime(match.openDate)}</span>
              </div>
              <div className="soccer-card-row">
                <span className="soccer-label">Status:</span>
                <span>
                  {isLive ? (
                    <span className="badge bg-success">Live</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Upcoming</span>
                  )}
                </span>
              </div>
              <div className="soccer-card-row soccer-card-action">
                <button
                  className="btn btn-success view-tip"
                  onClick={() => handleViewTip(eventId, match.markets)}
                >
                  View Tip
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedMatchTable;
