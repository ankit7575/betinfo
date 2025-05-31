import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button, Modal } from 'react-bootstrap';
import socket from '../socket';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTip.css';

// Sections and Components
import AppLayout from '../layout';
import Footer from '../components/Footer';
import SoccerScoreboardCard from './sections/SoccerScoreboardCard';
import OpeningBalance from './sections/OpeningBalance';
import LiveTipsTable from './sections/LiveTipsTable';
import IframeBox from './sections/IframeBox';
import TipHistoryTable from './sections/TipHistoryTable';
import BalanceDisplay from './sections/BalanceDisplay';
import BetfairMarketTable from './sections/BetfairMarketTable';

// Redux Actions
import {
  getMatchById,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
  getScoreboardByEventId,
  getBetfairOddsForRunner,
} from '../actions/matchaction';
import { redeemCoinForAllMatches } from '../actions/coinAction';
import { loadUser } from '../actions/userAction';

const SoccerTip = () => {
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
  const sportId = 1; // <<<--- Set this manually as required

  // Auto-refresh page only once per event for each session/tab
  useEffect(() => {
    if (!eventId) return;
    const reloadKey = 'soccerTipAutoReloaded_' + eventId;
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
    match,
  } = useSelector((state) => state.match || {});
  const { user, loading: userLoadingState } = useSelector((state) => state.user || {});
  const userId = user?._id;

  // Update 'now' every second for real-time expiry checks
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      const result = await dispatch(getBetfairOddsForRunner(eventId));
      if (result?.payload?.runners) {
        setRunnerOdds(result.payload.runners);
      } else {
        setRunnerOdds([]);
      }
    };

    if (eventId) fetchAllRunnersOdds();
  }, [dispatch, eventId]);

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

  // --- COIN REDEEM LOGIC ---
  const allCoins = user?.keys?.flatMap((key) => key.coin || []) || [];

  // Find a coin already redeemed for this event and not expired
  const alreadyRedeemedCoin = allCoins.find(
    (coin) =>
      (coin.usedForEventId?.toString() === eventId) &&
      coin.expiresAt &&
      new Date(coin.expiresAt) > now
  );

  // Unused coins (not yet used for any event)
  const unusedCoins = allCoins.filter((coin) => !coin.usedAt);

  // Only show "No Coins Available!" if NOT already redeemed for this match
  const hasNoCoins = user?.coinAvailable === 0 && !alreadyRedeemedCoin;

  // Only show redeem prompt if not already redeemed for this event
  const showRedeemPrompt = user?.coinAvailable > 0 && !alreadyRedeemedCoin;
  const openingBalanceMissing = !userOddsAndInvestment?.openingbalance;

  // --- COIN REDEEM HANDLER ---
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
      window.location.reload(); // Refresh after successful redeem
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
                  handleSubmit={async (e) => {
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
                  }}
                />
              </div>
              <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                <BalanceDisplay amount={userOddsAndInvestment?.openingbalance} />
              </div>
              <div className='col-lg-12 col-md-12 col-12' />
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
            <SoccerScoreboardCard
              eventId={eventId}
              iframeLoaded={iframeLoaded}
              setIframeLoaded={setIframeLoaded}
              iframeError={iframeError}
              setIframeError={setIframeError}
            />
            <IframeBox
              eventId={eventId}
              sportId={sportId}
              iframeLoaded={iframeLoaded}
              setIframeLoaded={setIframeLoaded}
              iframeError={iframeError}
              setIframeError={setIframeError}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SoccerTip;
