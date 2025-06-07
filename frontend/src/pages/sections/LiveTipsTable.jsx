import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, 
  // Button, 
  // Form, 
  // Row, 
  // Col 
} from 'react-bootstrap';
import { getMatchById, addAdminBetfairOdds, getBetfairOddsForRunner } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import BetfairMarketTable from './BetfairMarketTable';
import './LiveTipsTable.css';
import TipHistoryTable from './TipHistoryTable';
import socket from '../../socket';

const LiveTipsTable = ({ eventId }) => {
  const dispatch = useDispatch();
  const { match, loading, userOddsAndInvestment } = useSelector((state) => state.match || {});
  const [runnerOdds, setRunnerOdds] = useState([]);
  const [latestTip, setLatestTip] = useState([]);

  useEffect(() => {
    if (eventId && userOddsAndInvestment?.userId) dispatch(getMatchById(eventId, userOddsAndInvestment?.userId));
  }, [dispatch, eventId, userOddsAndInvestment?.userId]);

  useEffect(() => {
    if (eventId && userOddsAndInvestment?.userId) {
      dispatch(getBetfairOddsForRunner(eventId, userOddsAndInvestment?.userId)).then((result) => {
        if (result?.payload?.runners) setRunnerOdds(result.payload.runners);
        else setRunnerOdds([]);
      });
    }
  }, [dispatch, eventId, userOddsAndInvestment?.userId]);

  // For one-click odds from BetfairMarketTable
  const handleOddsClick = async (tip) => {
    try {
      const data = {
        odds: {
          back: tip?.side === 'Back' ? parseFloat(tip?.odd) : null,
          lay: tip?.side === 'Lay' ? parseFloat(tip?.odd) : null,
        },
        Ammount: {
          back: tip?.side === 'Back' ? parseFloat(tip?.amount) : null,
          lay: tip?.side === 'Lay' ? parseFloat(tip?.amount) : null,
        },
        userId: userOddsAndInvestment?.userId,
        type: 'user',
      };
      await dispatch(addAdminBetfairOdds(eventId, tip?.runner, data));
      await dispatch(getMatchById(eventId, userOddsAndInvestment?.userId));
    } catch (error) {
      console.error("Error submitting from table:", error);
    }
  };

  // Use matchRunners for all lookups
  const matchRunners = match?.matchRunners || [];
  const latest = match?.adminBetfairOdds?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;
  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (!userOddsAndInvestment?.userId) {
    return;
  }
  return (
    <div className="live-tips-table-wrap container mt-4">
      <h4 className="live-tips-header-row">
        Live Tips - {match?.eventName}
      </h4>

      {/* Betfair Market Table with odds click handler */}
      <BetfairMarketTable
        matchData={{
          eventId,
          market: { runners: runnerOdds },
          matchRunners,
        }}
        handleSubmit={handleOddsClick}
        pnl={match?.netProfit ?? []}
        socket={socket}
        userId={userOddsAndInvestment?.userId}
        type='user'
      />

      {/* Latest Tips Table */}
      <div className="latest-odds mt-4 live-tips-scroll">
        <h4>Latest Tip</h4>
        <table className="table table-bordered table-striped live-tips-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Side</th>
              <th>Odd</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
             {latestTip ? (
                <tr>
                  <td>{latestTip.runnerName}</td>
                  <td>{latestTip.side || 'N/A'}</td>
                  <td>{latestTip.rate || 'N/A'}</td>
                  <td>{latestTip.amount || 'N/A'}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No runner data.</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <TipHistoryTable
        adminBetfairOdds={match?.adminBetfairOdds}
        userOwnOdds={match?.userOwnOdds}
        adminOpeningBalance={match?.openingbalance || 200000}
        userOpeningBalance={userOddsAndInvestment?.openingbalance || 0}
        userId={userOddsAndInvestment?.userId}
        eventId={eventId}
        setLatestTip={setLatestTip}
        socket={socket}
      />
    </div>
  );
};

export default LiveTipsTable;
