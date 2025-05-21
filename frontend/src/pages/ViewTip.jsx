import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';
import socket from '../socket'; // <<-- Import global singleton socket
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTip.css';

import AppLayout from '../layout';
import Footer from '../components/Footer';
import ScoreboardCard from './sections/ScoreboardCard';
import OpeningBalance from './sections/OpeningBalance';
import LiveTipsTable from './sections/LiveTipsTable';
import IframeBox from './sections/IframeBox';
import TipHistoryTable from './sections/TipHistoryTable';
import BalanceDisplay from './sections/BalanceDisplay';
import BetfairMarketTable from './sections/BetfairMarketTable';
import CoinCountdown from '../pages/CoinCountdown';

import {
  getMatchById,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
  getScoreboardByEventId,
  getBetfairOddsForRunner
} from '../actions/matchaction';

import { loadUser } from '../actions/userAction';

const ViewTip = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentLoading, setInvestmentLoading] = useState(false);
  const [transactionError, setTransactionError] = useState('');
  const [latestOddsHistory, setLatestOddsHistory] = useState([]);
  const [runnerOdds, setRunnerOdds] = useState([]);

  const query = new URLSearchParams(location.search);
  const eventId = query.get('eventId');

  const {
    loading,
    userOddsAndInvestment,
    userLoading,
    scoreboard,
    match
  } = useSelector((state) => state.match || {});
  const { user, loading: userLoadingState } = useSelector((state) => state.user || {});
  const userId = user?._id;

  // Fetch initial data from Redux
  const fetchInitialData = useCallback(() => {
    if (eventId) {
      dispatch(getMatchById(eventId));
      dispatch(getUserMatchOddsAndInvestment(eventId));
      dispatch(getScoreboardByEventId(eventId));
    } else {
      navigate('/');
    }
  }, [dispatch, eventId, navigate]);

  useEffect(() => {
    if (!user) dispatch(loadUser());
    fetchInitialData();
  }, [dispatch, user, fetchInitialData]);

  // Real-time odds via socket.io
  useEffect(() => {
    if (!userId || !eventId) return;

    socket.emit('join', userId);
    socket.emit('requestUserOddsUpdate', { eventId, userId });

    const handleUserOddsUpdated = (data) => {
      if (data?.eventId !== eventId) return;
      if (data?.success && data?.oddsHistory) {
        setLatestOddsHistory(data.oddsHistory);
      }
    };

    socket.on('userOddsUpdated', handleUserOddsUpdated);

    return () => {
      socket.emit('leave', userId);
      socket.off('userOddsUpdated', handleUserOddsUpdated);
    };
  }, [userId, eventId]);

  // Betfair runners for Market Table (not tips, just display)
  useEffect(() => {
    const fetchAllRunnersOdds = async () => {
      try {
        const result = await dispatch(getBetfairOddsForRunner(eventId));
        if (result?.payload?.runners) {
          setRunnerOdds(result.payload.runners);
        }
      } catch (err) {
        setRunnerOdds([]);
      }
    };

    if (eventId) {
      fetchAllRunnersOdds();
    }
  }, [dispatch, eventId]);

  // Investment submit handler
  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    if (!investmentAmount) return;
    setTransactionError('');
    setInvestmentLoading(true);
    try {
      await dispatch(userAddInvestment(eventId, Number(investmentAmount)));
      await dispatch(getUserMatchOddsAndInvestment(eventId));
      setInvestmentAmount('');
    } catch (err) {
      setTransactionError('⚠️ Transaction failed: ' + (err.message || 'Please try again.'));
    } finally {
      setInvestmentLoading(false);
    }
  };

  // Fallback tips for LiveTipsTable (on reload, before socket fires)
  const getFallbackLatestTips = () => {
    const odds = userOddsAndInvestment?.oddsHistory || userOddsAndInvestment?.userOdds || [];
    return odds.map((item) => ({
      runnerName: item.runnerName || 'Unknown',
      odds: item.odds || { back: 0, lay: 0 },
      Ammount: item.Ammount || { back: 0, lay: 0 },
      Profit: item.Profit || { back: 0, lay: 0 },
      expiresAt: item.expiresAt || undefined
    }));
  };

  const liveTipsToShow =
    latestOddsHistory.length > 0 ? latestOddsHistory : getFallbackLatestTips();

  // Fallback scoreboard
  const fallbackScoreboard = {
    title: 'Live Match Scoreboard',
    team1: match?.matchRunners?.[0]?.runnerName || 'Team A',
    team2: match?.matchRunners?.[1]?.runnerName || 'Team B',
    score1: '0',
    score2: '0',
    wicket1: '0',
    wicket2: '0',
    ballsDone1: 0,
    ballsDone2: 0,
    target: 0,
    required: '-',
    recentBalls: [],
    status: 'Match has not started yet or no live data available',
  };

  // Alerts logic
  const now = new Date();
  const activeCoinInUse = user?.keys?.some((key) =>
    key.coin?.some((c) => {
      if (!c.usedAt) return false;
      const usedDate = new Date(c.usedAt);
      return now <= new Date(usedDate.getTime() + 24 * 60 * 60 * 1000);
    })
  );
  const hasPendingTransaction =
    Array.isArray(user?.transactions) &&
    user.transactions.some((tx) => tx.status?.toLowerCase() === 'pending');
  const hasNoCoins = user?.coinAvailable === 0;
  const showRedeemPrompt = user?.coinAvailable > 0 && !activeCoinInUse;
  const openingBalanceMissing = !userOddsAndInvestment?.openingbalance;

  if (loading || userLoading || userLoadingState) {
    return <div className="text-center my-4"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <>
      <AppLayout />
      <div className="container-fluid mt-5">
        <div className='row' >
          <div className='col-lg-8 col-md-8 col-12' >
           {hasPendingTransaction && (
          <Alert variant="danger" className="text-center">
            <strong>⏳ Your transaction is under review.</strong><br />
            You will receive coins once it is verified by our team.
          </Alert>
        )}

        {transactionError && (
          <Alert variant="danger" className="text-center">
            {transactionError}
          </Alert>
        )}

        {hasNoCoins && (
          <Alert variant="warning" className="text-center">
            <strong>⚠️ No Coins Available!</strong><br />
            Please wait if you have made a transaction.<br />
            If not, please purchase coins to continue.
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.open('/payment', '_blank')}>
                Buy Coins
              </Button>
            </div>
          </Alert>
        )}

        {showRedeemPrompt && !hasPendingTransaction && (
          <>
            <Alert variant="info" className="text-center">
              <strong>🎟️ You have coins!</strong><br />
              Please redeem your coin to activate access.
            </Alert>
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.open('/redeem', '_blank')}>
                Redeem Now
              </Button>
            </div>
          </>
        )}

        {openingBalanceMissing && (
          <Alert variant="warning" className="text-center">
            <strong>⚠️ Please add your Opening Balance to proceed.</strong>
          </Alert>
        )}
            <ScoreboardCard
  scoreboard={scoreboard?.team1 ? scoreboard : fallbackScoreboard}
  socket={socket}
/>
<BetfairMarketTable
  matchData={{
    eventId,
    market: { runners: runnerOdds },
    matchRunners: match?.matchRunners || []
  }}
  socket={socket}
/>

        {/* LiveTipsTable receives real-time odds as fallbackData */}
        <LiveTipsTable
          eventId={eventId}
          userId={userId}
          fallbackData={liveTipsToShow}
        />

          </div>
          <div className='col-lg-4 col-md-4 col-12' >
<OpeningBalance
          investmentAmount={investmentAmount}
          setInvestmentAmount={setInvestmentAmount}
          investmentLoading={investmentLoading}
          handleSubmit={handleInvestmentSubmit}
        />

        <BalanceDisplay amount={userOddsAndInvestment?.openingbalance} />
          <IframeBox
          eventId={eventId}
          iframeLoaded={iframeLoaded}
          setIframeLoaded={setIframeLoaded}
          iframeError={iframeError}
          setIframeError={setIframeError}
        />
          </div>
        </div>

        <TipHistoryTable
          adminBetfairOdds={match?.adminBetfairOdds || []}
          adminOpeningBalance={match?.openingbalance || 200000}
          userOpeningBalance={userOddsAndInvestment?.openingbalance || 0}
          userId={userOddsAndInvestment?.userId}
          socket={socket} // <<-- Pass the ONE socket here!
        />
      </div>
      <CoinCountdown />
      <Footer />
    </>
  );
};

export default ViewTip;
