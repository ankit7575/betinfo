import React, { useEffect } from 'react';
import Layout from "../../layouts/layout"; // Import your Layout component
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMatches } from '../../../../actions/matchaction';  // Correct action import
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewAllMatches.css';

const Viewallmatches = ({ sportId = 4 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use the correct reducer key: state.match
  const matchList = useSelector((state) => state.match);
  const { loading, matches = [] } = matchList || {};

  useEffect(() => {
    dispatch(getMatches(sportId));  // Dispatching the new action `getMatches`
  }, [dispatch, sportId]);

  // Separate the matches based on coming or live status
  const upcomingMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      const now = new Date();
      return matchTime > now && Array.isArray(match.matchRunners) && match.matchRunners.length === 2;
    })
    .slice(0, 25); // Limit to the first 5 upcoming matches

  const liveMatches = matches
    .filter((match) => {
      const matchTime = new Date(match.openDate);
      const now = new Date();
      return matchTime <= now && Array.isArray(match.matchRunners) && match.matchRunners.length === 2;
    })
    .slice(0, 20); // Limit to the first 5 live matches

  const formatMatchTime = (openDate) => {
    const matchTime = new Date(openDate);
    return `Today ${matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getMatchStatus = (openDate) => {
    const now = new Date();
    const matchTime = new Date(openDate);
    return matchTime > now ? 'Coming' : 'Live';
  };

  if (loading) return <div>Loading matches...</div>;


  if (!upcomingMatches.length && !liveMatches.length) return <div>No valid 1-vs-1 matches found</div>;

  return (
    <>
      <Layout userRole="admin">
        <div className="container mt-4">
          <h1 className="mb-4">Cricket: Upcoming and Live Matches</h1>
          
          {/* Live Matches Section */}
          {liveMatches.length > 0 && (
            <div>
              <h2>Live Matches</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Teams</th>
                      <th>Match Time</th>
                      <th>Status</th>
                      <th>Competition</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveMatches.map((match, index) => {
                      const teamNames =
                        match.eventName || match.matchRunners.map((r) => r.runnerName).join(' vs ');
                      const status = getMatchStatus(match.openDate);

                      return (
                        <tr key={index}>
                          <td>{teamNames}</td>
                          <td>{formatMatchTime(match.openDate)}</td>
                          <td>{status}</td>
                          <td>{match.competitionName || 'N/A'}</td>
                          <td>
                          <button
  className="btn btn-secondary"
  onClick={() => {
    // Navigate to the Add Data page with match info
    if (match && match.eventId) {
      match.matchRunners.forEach((runner) => {
        navigate(`/dashboard/odds/add-data`, {
          state: {
            eventId: match.eventId,
            selectionId: runner.selectionId,  // Pass the selectionId for each runner
            marketIds: match.markets?.map((market) => market.marketId).join(',') || ''
          },
        });
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
          )} 
          
          {/* Upcoming Matches Section */}
          {upcomingMatches.length > 0 && (
            <div>
              <h2>Upcoming Matches</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Teams</th>
                      <th>Match Time</th>
                      <th>Status</th>
                      <th>Competition</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingMatches.map((match, index) => {
                      const teamNames =
                        match.eventName || match.matchRunners.map((r) => r.runnerName).join(' vs ');
                      const status = getMatchStatus(match.openDate);

                      return (
                        <tr key={index}>
                          <td>{teamNames}</td>
                          <td>{formatMatchTime(match.openDate)}</td>
                          <td>{status}</td>
                          <td>{match.competitionName || 'N/A'}</td>
                          <td>
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                // Navigate to the Add Data page with match info
                                if (match && match.eventId) {
                                  navigate(`/dashboard/odds/add-data`, {
                                    state: {
                                      eventId: match.eventId,
                                      marketIds: match.markets?.map((market) => market.marketId).join(',') || ''
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
          )}
        </div>
      </Layout>
    </>
  );
};

export default Viewallmatches;
