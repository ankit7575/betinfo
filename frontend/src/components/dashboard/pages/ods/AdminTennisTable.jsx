import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getTennisMatches,
  updateMatchSelectedStatus,
  updateMatchAdminStatus
} from '../../../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewAllMatches.css';

const statusOptions = [
  "",
  "Normal",
  "Rainy",
  "Delayed",
  "Pitch Issue",
  "Suspended",
  "Other"
];

const AdminTennisTable = ({ sportId = 2 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, tennisMatches = [] } = useSelector((state) => state.match) || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdating, setStatusUpdating] = useState({});
  const [selectUpdating, setSelectUpdating] = useState({});
  const [optimisticMatches, setOptimisticMatches] = useState([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState([]);
  const [bulkAdminStatus, setBulkAdminStatus] = useState('');
  const [bulkStatusUpdating, setBulkStatusUpdating] = useState(false);
  const [bulkSelectUpdating, setBulkSelectUpdating] = useState(false);

  useEffect(() => {
    dispatch(getTennisMatches());
    // eslint-disable-next-line
  }, [dispatch, sportId]);

  useEffect(() => {
    setOptimisticMatches(tennisMatches);
    setSelectedMatchIds([]);
  }, [tennisMatches]);

  // Date Helpers
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const tomorrowStart = new Date(todayEnd.getTime() + 1);
  const tomorrowEnd = new Date(tomorrowStart.getFullYear(), tomorrowStart.getMonth(), tomorrowStart.getDate(), 23, 59, 59, 999);
  const isToday = (date) => date >= todayStart && date <= todayEnd;
  const isTomorrow = (date) => date >= tomorrowStart && date <= tomorrowEnd;

  // Search/Filter logic
  const normalize = (str) =>
    (str || '').toString().toLowerCase().replace(/[\s-]+/g, '');

  const searchFilter = (match) => {
    if (!searchTerm) return true;
    const term = normalize(searchTerm);

    const playerNames =
      match.eventName ||
      (Array.isArray(match.matchRunners)
        ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
        : '');
    const competition = match.competitionName || '';
    return (
      normalize(playerNames).includes(term) ||
      normalize(competition).includes(term)
    );
  };

  // Only valid 1-vs-1 matches with runners, date, and markets
  const filteredMatches = (optimisticMatches.length > 0 ? optimisticMatches : tennisMatches).filter(
    (match) =>
      Array.isArray(match.matchRunners) &&
      match.matchRunners.length === 2 &&
      Array.isArray(match.markets) &&
      match.markets.length > 0 &&
      match.openDate &&
      !isNaN(new Date(match.openDate))
  );

  // Today, Tomorrow, Live (past), sorted
  const todayMatches = filteredMatches
    .filter(match => isToday(new Date(match.openDate)) && searchFilter(match))
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const tomorrowMatches = filteredMatches
    .filter(match => isTomorrow(new Date(match.openDate)) && searchFilter(match))
    .sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

  const liveMatches = filteredMatches
    .filter(match => {
      const matchTime = new Date(match.openDate);
      return matchTime <= now && searchFilter(match);
    })
    .sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

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

  const getMatchStatus = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime > now ? 'Upcoming' : 'Live';
  };

  // ---- Multi-select logic ----
  const handleRowCheckbox = (eventId) => {
    setSelectedMatchIds((prev) =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSelectAll = (matchList) => {
    const allIds = matchList.map(m => m.eventId);
    if (allIds.every(id => selectedMatchIds.includes(id))) {
      setSelectedMatchIds([]);
    } else {
      setSelectedMatchIds(allIds);
    }
  };

  // Update selected/unselected
  const handleSelectChange = async (eventId, selected) => {
    setSelectUpdating((prev) => ({ ...prev, [eventId]: true }));
    setOptimisticMatches((prev) =>
      prev.map((match) =>
        match.eventId === eventId
          ? { ...match, selected: !selected }
          : match
      )
    );
    await dispatch(updateMatchSelectedStatus({ eventId, selected: !selected }));
    setSelectUpdating((prev) => ({ ...prev, [eventId]: false }));
  };

  // Update admin status
  const handleAdminStatusChange = async (eventId, adminStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [eventId]: true }));
    setOptimisticMatches((prev) =>
      prev.map((match) =>
        match.eventId === eventId
          ? { ...match, adminStatus }
          : match
      )
    );
    await dispatch(updateMatchAdminStatus({ eventId, adminStatus }));
    setStatusUpdating((prev) => ({ ...prev, [eventId]: false }));
  };

  // ---- Bulk Action Handlers ----
  const handleBulkSelect = async (selectValue) => {
    setBulkSelectUpdating(true);
    setOptimisticMatches((prev) =>
      prev.map((match) =>
        selectedMatchIds.includes(match.eventId)
          ? { ...match, selected: selectValue }
          : match
      )
    );
    await Promise.all(selectedMatchIds.map(eventId =>
      dispatch(updateMatchSelectedStatus({ eventId, selected: selectValue }))
    ));
    setBulkSelectUpdating(false);
  };

  const handleBulkAdminStatus = async () => {
    if (!bulkAdminStatus) return;
    setBulkStatusUpdating(true);
    setOptimisticMatches((prev) =>
      prev.map((match) =>
        selectedMatchIds.includes(match.eventId)
          ? { ...match, adminStatus: bulkAdminStatus }
          : match
      )
    );
    await Promise.all(selectedMatchIds.map(eventId =>
      dispatch(updateMatchAdminStatus({ eventId, adminStatus: bulkAdminStatus }))
    ));
    setBulkStatusUpdating(false);
    setBulkAdminStatus('');
  };

  // Pitch Status col if needed
  const shouldShowAdminStatus = (matchesToShow) =>
    matchesToShow.some(
      (match) => match.adminStatus && match.adminStatus.trim() && match.adminStatus.trim().toLowerCase() !== 'normal'
    );

  const renderTable = (matchList, dayLabel) => {
    if (!matchList.length) {
      return (
        <div className="white" style={{ padding: "16px 0", fontSize: '1.07rem', textAlign: 'center', opacity: 0.7 }}>
          No {dayLabel} matches found{searchTerm ? ' for your search.' : '.'}
        </div>
      );
    }
    const showAdminStatus = shouldShowAdminStatus(matchList);

    // Bulk action toolbar only if something checked
    const anySelected = matchList.some(m => selectedMatchIds.includes(m.eventId));
    return (
      <div>
        {anySelected && (
          <div className="mb-3 d-flex gap-2 align-items-center">
            <button
              className="btn btn-sm btn-success"
              disabled={bulkSelectUpdating}
              onClick={() => handleBulkSelect(true)}
            >
              {bulkSelectUpdating ? <span className="spinner-border spinner-border-sm"></span> : 'Bulk Select'}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={bulkSelectUpdating}
              onClick={() => handleBulkSelect(false)}
            >
              {bulkSelectUpdating ? <span className="spinner-border spinner-border-sm"></span> : 'Bulk Not Select'}
            </button>
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: 170 }}
              value={bulkAdminStatus}
              onChange={e => setBulkAdminStatus(e.target.value)}
            >
              <option value="">Bulk Admin Status</option>
              {statusOptions.filter(Boolean).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button
              className="btn btn-sm btn-warning"
              disabled={bulkStatusUpdating || !bulkAdminStatus}
              onClick={handleBulkAdminStatus}
            >
              {bulkStatusUpdating ? <span className="spinner-border spinner-border-sm"></span> : 'Apply Status'}
            </button>
            <span className="ms-2 small text-muted">
              ({selectedMatchIds.length} selected)
            </span>
          </div>
        )}

        <div className="table-responsive scroll-match-list">
          <table className="table table-bordered table-hover table-dark">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={matchList.every(m => selectedMatchIds.includes(m.eventId))}
                    onChange={() => handleSelectAll(matchList)}
                  />
                </th>
                <th>Players</th>
                <th>Date</th>
                <th>Match Time</th>
                <th>Status</th>
                <th>Competition</th>
                <th>Selected</th>
                {showAdminStatus && <th>Pitch Status</th>}
                <th>Admin Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matchList.map((match, idx) => {
                const playerNames =
                  match.eventName ||
                  (Array.isArray(match.matchRunners)
                    ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                    : 'N/A');
                const status = getMatchStatus(match.openDate);
                const selected = match.selected || false;
                const eventId = match.eventId;
                const adminStatus = match.adminStatus && match.adminStatus.trim();
                const matchDateObj = new Date(match.openDate);

                let extraTag = '';
                if (isToday(matchDateObj)) extraTag = 'Today';
                else if (isTomorrow(matchDateObj)) extraTag = 'Tomorrow';

                return (
                  <tr key={eventId || idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMatchIds.includes(eventId)}
                        onChange={() => handleRowCheckbox(eventId)}
                      />
                    </td>
                    <td>{playerNames}</td>
                    <td>
                      {formatMatchDate(match.openDate)}
                      <br />
                      <span className="badge bg-info text-dark">{extraTag}</span>
                    </td>
                    <td>{formatMatchTime(match.openDate)}</td>
                    <td>
                      <span className={`badge ${status === "Live" ? "bg-success" : "bg-warning text-dark"}`}>
                        {status}
                      </span>
                    </td>
                    <td>{match.competitionName || "N/A"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${selected ? "btn-success" : "btn-outline-secondary"}`}
                        disabled={selectUpdating[eventId]}
                        onClick={() => handleSelectChange(eventId, selected)}
                      >
                        {selectUpdating[eventId] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : selected ? "Selected" : "Not Selected"}
                      </button>
                    </td>
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
                      <select
                        className="form-select form-select-sm"
                        style={{ minWidth: 120 }}
                        value={match.adminStatus || ""}
                        disabled={statusUpdating[eventId]}
                        onChange={e => handleAdminStatusChange(eventId, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt || "Normal"}</option>
                        ))}
                      </select>
                      {statusUpdating[eventId] && (
                        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          if (match && match.eventId) {
                            navigate(`/dashboard/odds/add-data`, {
                              state: {
                                eventId: match.eventId,
                                marketIds: match.markets?.map((market) => market.marketId).join(',') || '',
                              },
                            });
                          }
                        }}
                      >
                        Odds
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading matches...</div>;
  if (!todayMatches.length && !tomorrowMatches.length && !liveMatches.length)
    return <div>No valid 1-vs-1 matches found</div>;

  return (
    <>
      <Helmet>
        <title>Admin Tennis Matches | betinfo.live</title>
        <meta name="description" content="Manage, approve, and update tennis match statuses and odds on betinfo.live" />
      </Helmet>
      <div className="container mt-4">
        <h1 className="mb-4">Tennis: Upcoming, Today, Tomorrow & Live Matches</h1>
        <div className="mb-4 search-box-dark" style={{ maxWidth: 400 }}>
          <input
            className="form-control form-control-lg search-dark-input"
            type="text"
            placeholder="🔍 Search players or competitions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="match-day-section mb-4">
          <div className="match-day-title mb-3">
            <span className="badge bg-success text-light" style={{ fontSize: '1.1rem', padding: '7px 22px', borderRadius: '14px', letterSpacing: 1 }}>
              LIVE MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderTable(liveMatches, "Live")}</div>
        </div>
        <div className="match-day-section mb-4">
          <div className="match-day-title mb-3">
            <span className="badge bg-info text-dark" style={{ fontSize: '1.1rem', padding: '7px 22px', borderRadius: '14px', letterSpacing: 1 }}>
              TODAY MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderTable(todayMatches, "Today")}</div>
        </div>
        <div className="match-day-section mb-4">
          <div className="match-day-title mb-3">
            <span className="badge bg-info text-dark" style={{ fontSize: '1.1rem', padding: '7px 22px', borderRadius: '14px', letterSpacing: 1 }}>
              TOMORROW MATCHES
            </span>
          </div>
          <div className="match-day-box scroll-match-list">{renderTable(tomorrowMatches, "Tomorrow")}</div>
        </div>
      </div>
    </>
  );
};

export default AdminTennisTable;
