import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTennisMatches, getBetfairOddsForRunner } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/Home/TipTable.css';
import SelectedMatchTable from './SelectedMatchTable';
import socket from '../../socket';

const ViewTennisMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, tennisMatches } = useSelector((state) => state.match || {});
  const { user } = useSelector((state) => state.user || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [liveOdds, setLiveOdds] = useState({});

  // Always use the backend-filtered matches, just toArray
  const matches = useMemo(() => Array.isArray(tennisMatches) ? tennisMatches : [], [tennisMatches]);

  // Load tennis matches once
  useEffect(() => {
    dispatch(getTennisMatches());
  }, [dispatch]);

  // Request odds for all returned matches (backend already validated)
  useEffect(() => {
    matches.forEach(match => {
      dispatch(getBetfairOddsForRunner(match.eventId));
      socket.emit('requestOddsUpdate', { eventId: match.eventId });
    });
    // eslint-disable-next-line
  }, [matches]);

  // Listen for live odds on socket, update state
  useEffect(() => {
    const handleOddsUpdate = (data) => {
      if (!data?.eventId || !data?.odds?.runners) return;
      setLiveOdds(prev => ({
        ...prev,
        [data.eventId]: data.odds.runners,
      }));
    };
    socket.on('betfair_odds_update', handleOddsUpdate);
    return () => {
      socket.off('betfair_odds_update', handleOddsUpdate);
    };
  }, []);

  // Date helpers
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const tomorrowStart = new Date(todayEnd.getTime() + 1);
  const tomorrowEnd = new Date(tomorrowStart.getFullYear(), tomorrowStart.getMonth(), tomorrowStart.getDate(), 23, 59, 59, 999);
  const isToday = (date) => date >= todayStart && date <= todayEnd;
  const isTomorrow = (date) => date >= tomorrowStart && date <= tomorrowEnd;

  // Search helpers
  const normalize = (str) =>
    (str || '').toString().toLowerCase().replace(/[\s-]+/g, '');

  const searchFilter = (match) => {
    if (!searchTerm) return true;
    const term = normalize(searchTerm);
    const playerNames = match.eventName ||
      (Array.isArray(match.matchRunners)
        ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
        : '');
    const competition = match.competitionName || '';
    return (
      normalize(playerNames).includes(term) ||
      normalize(competition).includes(term)
    );
  };

  // Only apply search filter; all other checks are backend!
  const searchedMatches = matches.filter(searchFilter);

  const todayMatches = searchedMatches
    .filter(match => isToday(new Date(match.openDate)))
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const tomorrowMatches = searchedMatches
    .filter(match => isTomorrow(new Date(match.openDate)))
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  // Odds formatter: Show runner name, Back and Lay as colored badges
  const OddsDisplay = ({ odds }) => {
    if (!Array.isArray(odds) || odds.length === 0) {
      return <span style={{ color: "#888" }}>N/A</span>;
    }
    return (
      <div>
        {odds.map((runner, i) => (
          <div key={runner.selectionId || i} style={{ marginBottom: 3 }}>
            <span style={{
              background: '#73bbee',
              color: '#13344c',
              fontWeight: 700,
              borderRadius: 6,
              padding: '2px 10px',
              marginRight: 8,
              display: 'inline-block'
            }}>
              Back {runner.availableToBack?.[0]?.price || "N/A"}
            </span>
            <span style={{
              background: '#faa9bc',
              color: '#731c36',
              fontWeight: 700,
              borderRadius: 6,
              padding: '2px 10px',
              display: 'inline-block'
            }}>
              Lay {runner.availableToLay?.[0]?.price || "N/A"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatMatchTime = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatMatchDate = (openDate) => {
    const d = new Date(openDate);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  const handleViewTip = (eventId, markets) => {
    const matchOddsMarket = markets?.find((m) => m.marketName === 'Match Odds');
    const matchOddsMarketId = matchOddsMarket?.marketId || '';
    navigate(`/tennistip?eventId=${eventId}&marketId=${matchOddsMarketId}`);
  };

  // Table rendering (desktop + mobile)
  const renderMatches = (matchesToShow, dayLabel) => {
    if (!matchesToShow.length) {
      return (
        <div className="white" style={{ padding: "24px 0", fontSize: '1.07rem', textAlign: 'center', opacity: 0.7 }}>
          No {dayLabel} tennis matches found{searchTerm ? ' for your search.' : '.'}
        </div>
      );
    }
    return (
      <>
        {/* --- Desktop Table --- */}
        <div className="table-responsive soccer-table-desktop">
          <table className="table table-bordered table-hover glow-border">
            <thead className="table-dark">
              <tr>
                <th>Players</th>
                <th>Date</th>
                <th>Match Time</th>
                <th>Status</th>
                <th>Competition</th>
                <th>Back/Lay</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matchesToShow.map((match, index) => {
                const playerNames =
                  Array.isArray(match.matchRunners)
                    ? match.matchRunners.map((r, idx) => (
                        <span key={r.selectionId || idx}>
                          {r.runnerName}
                          {idx < match.matchRunners.length - 1 && <br />}
                        </span>
                      ))
                    : match.eventName || 'N/A';
                const eventId = match.eventId;
                const matchDateObj = new Date(match.openDate);
                const isLive = matchDateObj <= now;
                const odds = liveOdds[eventId];
                return (
                  <tr key={eventId || index}>
                    <td>{playerNames}</td>
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
                    <td>
                      <OddsDisplay odds={odds} />
                    </td>
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
        {/* --- Mobile Cards --- */}
        <div className="soccer-table-mobile">
          {matchesToShow.map((match, index) => {
            const playerNames =
              Array.isArray(match.matchRunners)
                ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                : match.eventName || 'N/A';
            const eventId = match.eventId;
            const matchDateObj = new Date(match.openDate);
            const isLive = matchDateObj <= now;
            const odds = liveOdds[eventId];
            return (
              <div className="soccer-card" key={eventId || index}>
                <div className="soccer-card-header">
                  <span className="soccer-teams">{playerNames}</span>
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
                <div className="soccer-card-row">
                  <span className="soccer-label">Back/Lay:</span>
                  <OddsDisplay odds={odds} />
                </div>
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

  if (loading) return <div>Loading tennis matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="p-5 mt-4 pt-1">
        <h1 className="mb-4 white">Tennis Match Tips</h1>
        <div className="mb-4 search-box-dark">
          <input
            className="form-control form-control-lg search-dark-input"
            type="text"
            placeholder="🔍 Search players or competitions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <SelectedMatchTable matches={matches} user={user} now={now} />
        <div className="match-day-section mb-5">
          <div className="match-day-title mb-3">
            <span className="badge bg-info text-dark" style={{ fontSize: '1.13rem', padding: '7px 24px', borderRadius: '16px', letterSpacing: 1 }}>
              TODAY MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderMatches(todayMatches, "Today")}</div>
        </div>
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

export default ViewTennisMatch;
