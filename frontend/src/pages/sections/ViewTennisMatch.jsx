import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTennisMatches } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/Home/TipTable.css';

const ViewTennisMatch = () => {
  const dispatch = useDispatch();
  const { loading, error, tennisMatches = [] } = useSelector((state) => state.match || {});

  useEffect(() => {
    dispatch(getTennisMatches());
  }, [dispatch]);

  // Only show matches where selected: true and valid runners/markets
  const filteredMatches = tennisMatches.filter(
    match =>
      match.selected &&
      Array.isArray(match.matchRunners) &&
      match.matchRunners.length === 2 &&
      Array.isArray(match.markets) &&
      match.markets.length > 0
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

  const openViewTipInNewTab = (eventId, markets) => {
    const matchOddsMarket = markets?.find((m) => m.marketName === 'Match Odds');
    const matchOddsMarketId = matchOddsMarket?.marketId || '';
    const url = `/tennisTip?eventId=${eventId}&marketId=${matchOddsMarketId}`;
    window.location.href = url;
  };

  // Utility: show Admin Status column only if needed
  const shouldShowAdminStatus = (matchesToShow) =>
    matchesToShow.some(
      (match) => match.adminStatus && match.adminStatus.trim() && match.adminStatus.trim().toLowerCase() !== 'normal'
    );

  const renderTable = (matchesToShow) => {
    if (!matchesToShow.length) {
      return <div className="white">No matches found</div>;
    }

    const showAdminStatus = shouldShowAdminStatus(matchesToShow);
    const now = new Date();

    return (
      <div className="table-responsive mb-4" id="viewtip" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered table-hover glow-border">
          <thead className="table-dark">
            <tr>
              <th>Players</th>
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
              const playerNames =
                match.eventName ||
                (Array.isArray(match.matchRunners)
                  ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                  : 'N/A');
              const matchDate = new Date(match.openDate);
              const isLive = matchDate <= now;
              const eventId = match.eventId;
              const adminStatus = match.adminStatus && match.adminStatus.trim();

              return (
                <tr key={eventId || index}>
                  <td>{playerNames}</td>
                  <td>{formatMatchDate(match.openDate)}</td>
                  <td>{formatMatchTime(match.openDate)}</td>
                  <td>
                    <span className={`badge ${isLive ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {isLive ? 'Live' : 'Upcoming'}
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

  if (loading) return <div>Loading tennis matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="p-5 mt-4 pt-1">
        <h1 className="mb-4 white">Tennis Match Tips</h1>
        {renderTable(filteredMatches)}
      </div>
    </div>
  );
};

export default ViewTennisMatch;
