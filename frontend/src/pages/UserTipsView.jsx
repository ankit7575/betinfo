import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getMatchById,
  getScoreboardByEventId,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
} from '../actions/matchaction';
import {
  Spinner,
  Alert,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTip.css';
import AppLayout from '../layout';
import Footer from '../components/Footer';
import OddsLatestTable from './ViewTip/OddsLatestTable'; // ✅ imported new component
import OddsHistoryTable from './ViewTip/OddsHistoryTable'; // ✅ imported new component
import MatchDetails from './ViewTip/MatchDetails'; // ✅ imported new component

const ViewTip = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId } = location.state || {};
  const { loading, match } = useSelector((state) => state.match || {});
  const {
    loading: userLoading,
    error,
    userOddsAndInvestment,
  } = useSelector((state) => state.match || {});

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentLoading, setInvestmentLoading] = useState(false);

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [scoreboardError, setScoreboardError] = useState(false);

  const scoreboardState = useSelector((state) => state.scoreboard || {});

  useEffect(() => {
    if (eventId) {
      // Fetch match odds, investments, and scoreboard data
      dispatch(getMatchById(eventId, userOddsAndInvestment?.userId));
      dispatch(getUserMatchOddsAndInvestment(eventId));
      dispatch(getScoreboardByEventId(eventId))
        .catch(() => setScoreboardError(true));
    } else {
      navigate('/');
    }
  }, [dispatch, eventId, navigate]);

  const convertBallsToOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remaining = balls % 6;
    return `${overs}.${remaining}`;
  };

  const getScoreboardData = () => {
    const fallback = {
      t1: match?.matchRunners?.[0]?.runnerName || 'Team 1',
      t2: match?.matchRunners?.[1]?.runnerName || 'Team 2',
      score: '0', score2: '0',
      wicket: '0', wicket2: '0',
      ballsdone: 0, ballsdone2: 0,
      recentBalls: [["0", "0", "0", "0", "0", "0"]],
    };

    const data = scoreboardError || !scoreboardState?.t1 ? fallback : scoreboardState;

    return [
      {
        team: data.t1,
        score: `${data.score}-${data.wicket}`,
        overs: convertBallsToOvers(data.ballsdone),
        recentBalls: Array.isArray(data.recentBalls) ? data.recentBalls[0] : [],
      },
      {
        team: data.t2,
        score: `${data.score2}-${data.wicket2}`,
        overs: convertBallsToOvers(data.ballsdone2),
        recentBalls: Array.isArray(data.recentBalls) ? data.recentBalls[0] : [],
      },
    ];
  };

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    if (investmentAmount) {
      setInvestmentLoading(true);
      try {
        await dispatch(userAddInvestment(eventId, Number(investmentAmount)));
        await dispatch(getUserMatchOddsAndInvestment(eventId));
        setInvestmentAmount('');
      } catch (error) {
        console.error('Investment submission failed:', error);
      } finally {
        setInvestmentLoading(false);
      }
    }
  };


  const oddsHistory = userOddsAndInvestment?.oddsHistory || [];

  if (loading || userLoading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <AppLayout />
      <div className="container mt-5">
           {/* 🧮 User Match Odds & Investment */}
           <div className="card p-3 mb-3">
          <h2 className="fw-bold">User Match Odds & Investment</h2>
          <Form onSubmit={handleInvestmentSubmit} className="mb-3">
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter Investment Amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                disabled={investmentLoading}
              />
              <Button type="submit" variant="success" disabled={investmentLoading}>
                {investmentLoading ? 'Submitting...' : 'Add Investment'}
              </Button>
            </InputGroup>
          </Form>
        </div>

        <div className="card p-3 mb-3">
          <h5>Opening Balance: ₹{userOddsAndInvestment?.openingbalance ?? 0}</h5>
        </div>

        {/* Using the new MatchDetails component */}
        <MatchDetails match={match} />
        {/* 🏏 Scoreboard */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title">Scoreboard</h3>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Score</th>
                  <th>Overs</th>
                  <th>Recent Balls</th>
                </tr>
              </thead>
              <tbody>
                {getScoreboardData().map((teamData, index) => (
                  <tr key={index}>
                    <td>{teamData.team}</td>
                    <td>{teamData.score}</td>
                    <td>{teamData.overs}</td>
                    <td>{teamData.recentBalls.join(' | ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🧮 Match Odds */}
        {match?.matchRunners?.length && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="card-title">Match Odds</h3>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th colSpan="3" className="text-success">Back</th>
                    <th colSpan="3" className="text-danger">Lay</th>
                  </tr>
                  <tr>
                    <th></th>
                    {[1, 2, 3].map(i => <th key={`back-${i}`}>Price {i}</th>)}
                    {[1, 2, 3].map(i => <th key={`lay-${i}`}>Price {i}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {match.matchRunners.map((runner) => (
                    <tr key={runner.selectionId}>
                      <td>{runner.runnerName}</td>
                      {(runner.backOdds || []).map((odd, index) => (
                        <td key={index}>{odd}</td>
                      ))}
                      {(runner.layOdds || []).map((odd, index) => (
                        <td key={index}>{odd}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

     

        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : oddsHistory.length === 0 ? (
          <Alert variant="info">No odds history available.</Alert>
        ) : (
          <OddsLatestTable oddsHistory={oddsHistory} />
        )}

      

        {/* 📺 Live Box */}
        {eventId && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>Live Box</h4>
              {!iframeError ? (
                <div className="embed-responsive embed-responsive-16by9 position-relative">
                  {!iframeLoaded && (
                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                         style={{ background: '#f8f9fa', zIndex: 10 }}>
                      <span>Loading Live Box...</span>
                    </div>
                  )}
                  <iframe
                    title="Live Box"
                    src={`https://dpmatka.in/dtv.php?id=${eventId}`}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeError(true)}
                  />
                </div>
              ) : (
                <div className="alert alert-warning mt-3">
                  ⚠️ Match will be coming soon.
                </div>
              )}
            </div>
          </div>
        )}

{error ? (
          <Alert variant="danger">{error}</Alert>
        ) : oddsHistory.length === 0 ? (
          <Alert variant="info">No odds history available.</Alert>
        ) : (
          <OddsHistoryTable oddsHistory={oddsHistory} />
        )}

        {/* Error Handling */}
        
      </div>

      <Footer />
    </>
  );
};

export default ViewTip;
