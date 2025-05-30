import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // <-- Add this
import { getSoccerMatches } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/Home/TipTable.css';
import SelectedMatchTable from './SelectedMatchTable';

const ViewSoccerMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Add this
  const { loading, error, soccerMatches } = useSelector((state) => state.match || {});
  const { user } = useSelector((state) => state.user || {});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getSoccerMatches());
  }, [dispatch]);

  const matches = Array.isArray(soccerMatches) ? soccerMatches : [];

  // Filter: Admin-approved matches with enough data
  const filteredMatches = matches.filter(
    match =>
      match.selected &&
      Array.isArray(match.matchRunners) &&
      match.matchRunners.length >= 2 &&
      Array.isArray(match.markets) &&
      match.markets.length > 0 &&
      match.openDate &&
      !isNaN(new Date(match.openDate))
  );

  // Date Helpers
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const tomorrowStart = new Date(todayEnd.getTime() + 1);
  const tomorrowEnd = new Date(tomorrowStart.getFullYear(), tomorrowStart.getMonth(), tomorrowStart.getDate(), 23, 59, 59, 999);
  const isToday = (date) => date >= todayStart && date <= todayEnd;
  const isTomorrow = (date) => date >= tomorrowStart && date <= tomorrowEnd;

  // --- Search/Filter ---
  const normalize = (str) =>
    (str || '')
      .toString()
      .toLowerCase()
      .replace(/[\s-]+/g, '');

  const searchFilter = (match) => {
    if (!searchTerm) return true;
    const term = normalize(searchTerm);

    const teamNames = match.eventName ||
      (Array.isArray(match.matchRunners)
        ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
        : '');
    const competition = match.competitionName || '';
    return (
      normalize(teamNames).includes(term) ||
      normalize(competition).includes(term)
    );
  };

  // Sorted today/tomorrow matches, search filtered
  const todayMatches = filteredMatches
    .filter(match => {
      const matchDate = new Date(match.openDate);
      return isToday(matchDate) && searchFilter(match);
    })
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const tomorrowMatches = filteredMatches
    .filter(match => {
      const matchDate = new Date(match.openDate);
      return isTomorrow(matchDate) && searchFilter(match);
    })
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const formatMatchTime = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatMatchDate = (openDate) => {
    const d = new Date(openDate);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  // Replace window.open with useNavigate
  const handleViewTip = (eventId, markets) => {
    const matchOddsMarket = markets?.find((m) => m.marketName === 'Match Odds');
    const matchOddsMarketId = matchOddsMarket?.marketId || '';
    navigate(`/soccertip?eventId=${eventId}&marketId=${matchOddsMarketId}`);
  };

  const shouldShowAdminStatus = (matchesToShow) =>
    matchesToShow.some(
      (match) => match.adminStatus && match.adminStatus.trim() && match.adminStatus.trim().toLowerCase() !== 'normal'
    );

  // --- Table/Card rendering, reused for both sections ---
  const renderMatches = (matchesToShow, dayLabel) => {
    if (!Array.isArray(matchesToShow) || !matchesToShow.length) {
      return (
        <div className="white" style={{ padding: "24px 0", fontSize: '1.07rem', textAlign: 'center', opacity: 0.7 }}>
          No {dayLabel} soccer matches found{searchTerm ? ' for your search.' : '.'}
        </div>
      );
    }
    const showAdminStatus = shouldShowAdminStatus(matchesToShow);
    return (
      <>
        {/* Desktop Table */}
        <div className="table-responsive soccer-table-desktop">
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
                  match.eventName ||
                  (Array.isArray(match.matchRunners)
                    ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                    : 'N/A');
                const eventId = match.eventId;
                const adminStatus = match.adminStatus && match.adminStatus.trim();
                const matchDateObj = new Date(match.openDate);
                const isLive = matchDateObj <= now;
                return (
                  <tr key={eventId || index}>
                    <td>{teamNames}</td>
                    <td>
                      {formatMatchDate(match.openDate)}
                      <br />
                      <span className="badge bg-info text-dark">{dayLabel}</span>
                    </td>
                    <td>{formatMatchTime(match.openDate)}</td>
                    <td>
                      {isLive ? (
                        <span className="badge bg-success">Live</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Upcoming</span>
                      )}
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
          {matchesToShow.map((match, index) => {
            const teamNames =
              match.eventName ||
              (Array.isArray(match.matchRunners)
                ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                : 'N/A');
            const eventId = match.eventId;
            const adminStatus = match.adminStatus && match.adminStatus.trim();
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
                  <span>
                    {formatMatchDate(match.openDate)}
                    <span className="badge bg-info text-dark ms-2">{dayLabel}</span>
                  </span>
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
                {showAdminStatus && adminStatus && adminStatus.toLowerCase() !== 'normal' && (
                  <div className="soccer-card-row">
                    <span className="soccer-label">Pitch Status:</span>
                    <span className="badge bg-info text-dark">{adminStatus}</span>
                  </div>
                )}
                <div className="soccer-card-row soccer-card-action">
                  <button
                    className="btn btn-primary view-tip"
                    onClick={() => handleViewTip(eventId, match.markets)}
                  >
                    View Tip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  if (loading) return <div>Loading soccer matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="p-5 mt-4 pt-1">
        <h1 className="mb-4 white">Soccer Match Tips</h1>
        {/* --- Modern Search Filter --- */}
        <div className="mb-4 search-box-dark">
          <input
            className="form-control form-control-lg search-dark-input"
            type="text"
            placeholder="🔍 Search teams or competitions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Selected Matches Table (Redeemed by the user) */}
        <SelectedMatchTable matches={matches} user={user} now={now} />
        {/* --- Today Matches --- */}
        <div className="match-day-section mb-5">
          <div className="match-day-title mb-3">
            <span className="badge bg-info text-dark" style={{ fontSize: '1.13rem', padding: '7px 24px', borderRadius: '16px', letterSpacing: 1 }}>
              TODAY MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderMatches(todayMatches, "Today")}</div>
        </div>
        {/* --- Tomorrow Matches --- */}
        <div className="match-day-section mb-5">
          <div className="match-day-title mb-3">
            <span className="badge bg-info text-dark" style={{ fontSize: '1.13rem', padding: '7px 24px', borderRadius: '16px', letterSpacing: 1 }}>
              TOMORROW MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderMatches(tomorrowMatches, "Tomorrow")}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewSoccerMatch;
