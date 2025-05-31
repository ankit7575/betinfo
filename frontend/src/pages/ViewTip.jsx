import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button, Modal } from 'react-bootstrap';
import socket from '../socket';
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

import {
  getMatchById,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
  getScoreboardByEventId,
  getBetfairOddsForRunner,
} from '../actions/matchaction';
import { redeemCoinForAllMatches } from '../actions/coinAction';
import { loadUser } from '../actions/userAction';

const sportId = 4;

const ViewTip = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Local State
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentLoading, setInvestmentLoading] = useState(false);
  const [transactionError, setTransactionError] = useState('');
  const [latestOddsHistory, setLatestOddsHistory] = useState([]);
  const [runnerOdds, setRunnerOdds] = useState([]);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinMessage, setCoinMessage] = useState('');
  const [redeemingCoin, setRedeemingCoin] = useState(false);

  // Get eventId from URL
  const query = new URLSearchParams(location.search);
  const eventId = query.get('eventId');

    // Auto-refresh page only once per event
    useEffect(() => {
      if (!eventId) return;
      const reloadKey = 'viewtipAutoReloaded_' + eventId;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }, [eventId]);
  // Redux State Selectors
  const {
    loading,
    userOddsAndInvestment,
    userLoading,
    scoreboard,
    match,
  } = useSelector((state) => state.match || {});
  const { user, loading: userLoadingState } = useSelector((state) => state.user || {});
  const userId = user?._id;

  // --- Coin Logic ---
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allCoins = user?.keys?.flatMap((key) => key.coin || []) || [];

  // Find if a coin is redeemed for *this* event and still valid
  const alreadyRedeemedCoin = allCoins.find(
    (coin) =>
      coin.usedForEventId?.toString() === eventId &&
      coin.expiresAt &&
      new Date(coin.expiresAt) > now
  );

  // Coins not yet used for any event
  const unusedCoins = allCoins.filter((coin) => !coin.usedAt);

  // Show 'No Coins' only if NOT already redeemed for this match
  const hasNoCoins = user?.coinAvailable === 0 && !alreadyRedeemedCoin;
  // Show 'Redeem' only if not already redeemed for this event, and coins are available
  const showRedeemPrompt = user?.coinAvailable > 0 && !alreadyRedeemedCoin;
  const openingBalanceMissing = !userOddsAndInvestment?.openingbalance;

  // Fetch initial data on mount
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

  // Real-time odds updates (socket.io)
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

  // Fetch Betfair runners (Market Table)
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
    if (eventId) fetchAllRunnersOdds();
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

  // Coin Redeem Handler (with modal)
  const handleRedeemClick = () => {
    setCoinMessage('');
    setShowCoinModal(true);
  };

  const handleSelectCoinToRedeem = async (coinId) => {
    setRedeemingCoin(true);
    setCoinMessage('');
    try {
      await dispatch(redeemCoinForAllMatches(coinId, eventId));
      setCoinMessage('Coin redeemed successfully! Access granted for this match for 24 hours.');
      setShowCoinModal(false);
      await dispatch(loadUser());
      await dispatch(getUserMatchOddsAndInvestment(eventId));
    } catch (error) {
      let msg =
        (error && error.response && error.response.data && error.response.data.message) ||
        error.message ||
        typeof error === 'string'
          ? error
          : 'Failed to redeem coin. Please try again.';
      setCoinMessage(`Error: ${msg}`);
    } finally {
      setRedeemingCoin(false);
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
      expiresAt: item.expiresAt || undefined,
    }));
  };

  const liveTipsToShow =
    latestOddsHistory.length > 0 ? latestOddsHistory : getFallbackLatestTips();

  // Fallback scoreboard
  const fallbackScoreboard = {
    title: 'Scoreboard',
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

  // Loading Spinner
  if (loading || userLoading || userLoadingState) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <AppLayout />
      <div className="container-fluid mt-5">
        <div className="row">
          {/* Alerts */}
          {/* Only show transaction pending alert if not already redeemed for this event */}
          {!alreadyRedeemedCoin &&
            Array.isArray(user?.transactions) &&
            user.transactions.some((tx) => tx.status?.toLowerCase() === 'pending') && (
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
          {/* No Coins alert: only if NOT already redeemed for this event */}
          {!alreadyRedeemedCoin && hasNoCoins && (
            <Alert variant="warning" className="text-center">
              <strong>⚠️ No Coins Available!</strong><br />
              Please wait if you have made a transaction.<br />
              If not, please purchase coins to continue.
              <div className="mt-3">
                <Button variant="primary" onClick={() => navigate('/payment')}>
                  Buy Coins
                </Button>
              </div>
            </Alert>
          )}
          {/* Redeem prompt: only if NOT already redeemed for this event */}
          {!alreadyRedeemedCoin && showRedeemPrompt && (
            <>
              <Alert variant="info" className="text-center">
                <strong>🎟️ You have coins!</strong><br />
                Please redeem your coin to activate access for this match.
              </Alert>
              <div className="mt-3 pb-3 center">
                <Button
                  variant="primary"
                  onClick={handleRedeemClick}
                  disabled={unusedCoins.length === 0}
                >
                  Redeem Now
                </Button>
              </div>
              {coinMessage && (
                <div className="mt-2 text-center" style={{ color: coinMessage.startsWith('Error') ? 'red' : 'green' }}>
                  {coinMessage}
                </div>
              )}
            </>
          )}
          {openingBalanceMissing && (
            <Alert variant="warning" className="text-center">
              <strong>⚠️ Please add your Opening Balance to proceed.</strong>
            </Alert>
          )}
          <div className="col-lg-8 col-md-8 col-sm-8 col-12">
            {/* Coin selection Modal */}
            <Modal show={showCoinModal} onHide={() => setShowCoinModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Select a Coin to Redeem</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {unusedCoins.length === 0 ? (
                  <p>No unused coins available.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {unusedCoins.map((coin) => (
                      <li key={coin.id || coin._id} style={{ marginBottom: 12 }}>
                        <Button
                          variant="success"
                          block="true"
                          disabled={redeemingCoin}
                          onClick={() => handleSelectCoinToRedeem(coin.id || coin._id)}
                        >
                          {coin.shareableCode || coin.id || coin._id}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                {coinMessage && (
                  <div className="mt-2 text-center" style={{ color: coinMessage.startsWith('Error') ? 'red' : 'green' }}>
                    {coinMessage}
                  </div>
                )}
              </Modal.Body>
            </Modal>
            {/* Scoreboard & Market/Tips */}
            <div className="row">
              <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                <OpeningBalance
                  investmentAmount={investmentAmount}
                  setInvestmentAmount={setInvestmentAmount}
                  investmentLoading={investmentLoading}
                  handleSubmit={handleInvestmentSubmit}
                />
              </div>
              <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                <BalanceDisplay amount={userOddsAndInvestment?.openingbalance} />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <BetfairMarketTable
                  matchData={{
                    eventId,
                    market: { runners: runnerOdds },
                    matchRunners: match?.matchRunners || [],
                  }}
                  socket={socket}
                />
              </div>
              {/* Only show LiveTipsTable & TipHistoryTable if coin is redeemed for this event */}
              {alreadyRedeemedCoin && (
                <>
                  <div className='col-lg-12 col-md-12 col-12' >
                    <LiveTipsTable
                      eventId={eventId}
                      userId={userId}
                      fallbackData={liveTipsToShow}
                      socket={socket}
                    />
                  </div>
                  <div className='col-lg-12 col-12 ' >
                    <TipHistoryTable
                      adminBetfairOdds={match?.adminBetfairOdds || []}
                      adminOpeningBalance={match?.openingbalance || 200000}
                      userOpeningBalance={userOddsAndInvestment?.openingbalance || 0}
                      userId={userOddsAndInvestment?.userId}
                      socket={socket}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Sidebar Column */}
          <div className="col-lg-4 col-md-4 col-sm-4 col-12">
            <ScoreboardCard
              scoreboard={scoreboard?.team1 ? scoreboard : fallbackScoreboard}
              socket={socket}
            />
            <IframeBox
              eventId={eventId}
              iframeLoaded={iframeLoaded}
              setIframeLoaded={setIframeLoaded}
              iframeError={iframeError}
              setIframeError={setIframeError}
              sportId={sportId}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewTip;
