import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TipTable.css';

const TipTable = ({ sportId = 4 }) => {
  const dispatch = useDispatch();
  const { loading, error, matches = [] } = useSelector((state) => state.match || {});

  useEffect(() => {
    dispatch(getMatches(sportId));
  }, [dispatch, sportId]);

  // Only show matches that are selected by admin (selected: true)
  const filteredMatches = matches.filter((match) => match.selected);

  // Utility to determine if we need to show Admin Status column for given matches
  const shouldShowAdminStatus = (matchesToShow) =>
    matchesToShow.some(
      (match) => match.adminStatus && match.adminStatus.trim() && match.adminStatus.trim().toLowerCase() !== 'normal'
    );

  // Show all matches (you can keep today/tomorrow logic if you want)
  const allMatchesSorted = filteredMatches
    .filter((match) =>
      Array.isArray(match.matchRunners) &&
      match.matchRunners.length === 2 &&
      Array.isArray(match.markets) &&
      match.markets.length > 0 &&
      match.openDate &&
      !isNaN(new Date(match.openDate))
    )
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
    window.location.href = url;
  };

  const renderTable = (matchesToShow) => {
    if (!matchesToShow.length) {
      return <div className="white">No matches found</div>;
    }

    const showAdminStatus = shouldShowAdminStatus(matchesToShow);

    return (
      <div className="table-responsive mb-4" id="viewtip" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered table-hover glow-border">
          <thead className="table-dark">
            <tr>
              <th>Teams</th>
              <th>Date</th>
              <th>Match Time</th>
              <th>Status</th>
              <th>Competition</th>
              {showAdminStatus && <th>Pitch Status</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchesToShow.map((match, index) => {
              const teamNames =
                match.eventName || (Array.isArray(match.matchRunners)
                  ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                  : 'N/A');
              const matchDate = new Date(match.openDate);
              const now = new Date();
              const status = matchDate > now ? 'Coming' : 'Live';
              const eventId = match.eventId;
              const adminStatus = match.adminStatus && match.adminStatus.trim();

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
                  {showAdminStatus && (
                    <td>
                      {adminStatus && adminStatus.toLowerCase() !== 'normal' ? (
                        <span className="badge bg-info text-dark">{adminStatus}</span>
                      ) : (
                        ''
                      )}
                    </td>
                  )}
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
      <div className="p-5 mt-4 pt-1">
        <h1 className="mb-4 white">Cricket Match Tips</h1>
        {renderTable(allMatchesSorted)}
      </div>
    </div>
  );
};

export default TipTable;
