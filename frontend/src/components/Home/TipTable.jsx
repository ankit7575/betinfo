import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TipTable.css';

const TipTable = ({ sportId = 4 }) => {
  const dispatch = useDispatch();
  const { loading, error, matches = [] } = useSelector((state) => state.match || {});

  const now = new Date();
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    dispatch(getMatches(sportId));
  }, [dispatch, sportId]);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const todayMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      return (
        Array.isArray(match.matchRunners) &&
        match.matchRunners.length === 2 &&
        Array.isArray(match.markets) &&
        match.markets.length > 0 &&
        matchTime instanceof Date &&
        !isNaN(matchTime) &&
        isSameDate(matchTime, today)
      );
    })
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const tomorrowMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      return (
        Array.isArray(match.matchRunners) &&
        match.matchRunners.length === 2 &&
        Array.isArray(match.markets) &&
        match.markets.length > 0 &&
        matchTime instanceof Date &&
        !isNaN(matchTime) &&
        isSameDate(matchTime, tomorrow)
      );
    })
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

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

const openViewTipInNewTab = (eventId, markets) => {
  const matchOddsMarket = markets?.find((m) => m.marketName === 'Match Odds');
  const matchOddsMarketId = matchOddsMarket?.marketId || '';
  const url = `/viewtip?eventId=${eventId}&marketId=${matchOddsMarketId}`;
  window.location.href = url; // open in same tab
};

  const renderTable = (matchesToShow) => {
    if (!matchesToShow.length) {
      return <div className="white">No matches found</div>;
    }

    return (
      <div className="table-responsive mb-4"  id='viewtip' style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered table-hover glow-border">
          <thead className="table-dark">
            <tr>
              <th>Teams</th>
              <th>Date</th>
              <th>Match Time</th>
              <th>Status</th>
              <th>Competition</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchesToShow.map((match, index) => {
              const teamNames =
                match.eventName || match.matchRunners.map((r) => r.runnerName).join(' vs ');
              const matchDate = new Date(match.openDate);
              const status = matchDate > now ? 'Coming' : 'Live';
              const eventId = match.eventId;

              return (
                <tr key={eventId || index}>
                  <td>{teamNames}</td>
                  <td>{formatMatchDate(match.openDate)}</td>
                  <td>{formatMatchTime(match.openDate)}</td>
                  <td>
                    <span
                      className={`badge ${status === 'Live' ? 'bg-success' : 'bg-warning text-dark'}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>{match.competitionName || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-primary view-tip"
                      onClick={() => openViewTipInNewTab(eventId, match.markets)}
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
    );
  };

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="container mt-4">
        <h1 className="mb-4 white">Cricket Match Tips</h1>

        <h3 className="white mb-3">Today’s Matches</h3>
        {renderTable(todayMatches)}

        <h3 className="white mt-4 mb-3">Tomorrow’s Matches</h3>
        {renderTable(tomorrowMatches)}
      </div>
    </div>
  );
};

export default TipTable;
