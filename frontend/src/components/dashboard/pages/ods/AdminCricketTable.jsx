import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet for managing head
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getMatches,
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

const AdminCricketTable = ({ sportId = 4 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, matches = [] } = useSelector((state) => state.match) || {};
  const [statusUpdating, setStatusUpdating] = useState({});
  const [selectUpdating, setSelectUpdating] = useState({});

  useEffect(() => {
    dispatch(getMatches(sportId));
  }, [dispatch, sportId]);

  // Separate matches
  const now = new Date();
  const upcomingMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      return (
        matchTime > now &&
        Array.isArray(match.matchRunners) &&
        match.matchRunners.length === 2
      );
    })
    .slice(0, 25);

  const liveMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      return (
        matchTime <= now &&
        Array.isArray(match.matchRunners) &&
        match.matchRunners.length === 2
      );
    })
    .slice(0, 20);

  const formatMatchTime = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMatchStatus = (openDate) => {
    const matchTime = new Date(openDate);
    return matchTime > now ? 'Coming' : 'Live';
  };

  // Update selected/unselected
  const handleSelectChange = async (eventId, selected) => {
    setSelectUpdating((prev) => ({ ...prev, [eventId]: true }));
    await dispatch(updateMatchSelectedStatus({ eventId, selected: !selected }));
    setSelectUpdating((prev) => ({ ...prev, [eventId]: false }));
  };

  // Update admin status
  const handleAdminStatusChange = async (eventId, adminStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [eventId]: true }));
    await dispatch(updateMatchAdminStatus({ eventId, adminStatus }));
    setStatusUpdating((prev) => ({ ...prev, [eventId]: false }));
  };

  if (loading) return <div>Loading matches...</div>;
  if (!upcomingMatches.length && !liveMatches.length) return <div>No valid 1-vs-1 matches found</div>;

  const renderTable = (matchList, title) => (
    <div>
      <h2 className="mt-4">{title}</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>Teams</th>
              <th>Match Time</th>
              <th>Status</th>
              <th>Competition</th>
              <th>Selected</th>
              <th>Admin Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchList.map((match, idx) => {
              const teamNames =
                match.eventName || (Array.isArray(match.matchRunners)
                  ? match.matchRunners.map((r) => r.runnerName).join(' vs ')
                  : 'N/A');
              const status = getMatchStatus(match.openDate);
              const selected = match.selected || false;
              const eventId = match.eventId;

              return (
                <tr key={eventId || idx}>
                  <td>{teamNames}</td>
                  <td>{formatMatchTime(match.openDate)}</td>
                  <td>
                    <span className={`badge ${status === "Live" ? "bg-success" : "bg-warning text-dark"}`}>
                      {status}
                    </span>
                  </td>
                  <td>{match.competitionName || "N/A"}</td>
                  {/* Select/Unselect Toggle */}
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
                  {/* Admin Status Dropdown */}
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
                  {/* Odds button */}
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

  return (
    <>
      <Helmet>
        <title>Admin Cricket Matches | betinfo.live</title>
        <meta name="description" content="Manage, approve, and update cricket match statuses and odds on betinfo.live" />
      </Helmet>
      <div className="container mt-4 ">
        <h1 className="mb-4">Cricket: Upcoming and Live Matches</h1>
        {renderTable(liveMatches, "Live Matches")}
        {renderTable(upcomingMatches, "Upcoming Matches")}
      </div>
    </>
  );
};

export default AdminCricketTable;
