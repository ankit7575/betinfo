import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getMatchById,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
} from '../actions/matchaction';
import {
  Spinner,
  Alert,
  Button,
  Form,
  InputGroup,
  Table,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTip.css';
import AppLayout from '../layout';
import Footer from '../components/Footer';

const ViewTip = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
const eventId = location.state?.eventId || 34289123;
  const matchState = useSelector((state) => state.match || {});
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const { loading, match, userOddsAndInvestment, userLoading, error } = matchState;

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentLoading, setInvestmentLoading] = useState(false);
  const [latestTip, ] = useState(null);

  useEffect(() => {
    if (!eventId) return navigate('/');

    dispatch(getMatchById(eventId));
    dispatch(getUserMatchOddsAndInvestment(eventId));

  }, [dispatch, eventId, navigate]);

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    if (!investmentAmount) return;

    setInvestmentLoading(true);
    try {
      await dispatch(userAddInvestment(eventId, Number(investmentAmount)));
      await dispatch(getUserMatchOddsAndInvestment(eventId));
      setInvestmentAmount('');
    } catch (err) {
      console.error('Investment submission failed:', err);
    } finally {
      setInvestmentLoading(false);
    }
  };

  const oddsHistory = userOddsAndInvestment?.oddsHistory || [];

  const getInterleavedHistory = () => {
    const interleaved = [];
    const maxLength = Math.max(...oddsHistory.map((item) => item.history.length));
    for (let i = 0; i < maxLength; i++) {
      oddsHistory.forEach((item) => {
        if (item.history[i]) {
          interleaved.push({
            runnerName: item.runnerName,
            historyItem: item.history[i],
          });
        }
      });
    }
    return interleaved; // No sorting by timestamp
  };

  const getFinalHistory = () => {
    const history = latestTip ? [latestTip, ...getInterleavedHistory()] : getInterleavedHistory();

    const seen = new Set();
    const uniqueHistory = [];

    for (const item of history) {
      const key = `${item.runnerName}-${item.historyItem?.odds?.back}-${item.historyItem?.odds?.lay}-${item.historyItem?.Ammount?.back}-${item.historyItem?.Ammount?.lay}-${item.historyItem?.Profit?.back}-${item.historyItem?.Profit?.lay}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueHistory.push(item);
      }
    }

    return uniqueHistory;
  };

  const renderError = () => (
    <tr>
      <td colSpan="8" className="text-center">
        Access denied: Please redeem a valid coin to view match odds and investment.
        <div className="mt-3">
          {error !== 'User investment not found for this match' && (
            <Button variant="primary" onClick={() => navigate('/account')}>
              Go to Account to Redeem Coin
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  const renderErrorMessage = () => (
    <Alert variant="danger" className="text-center">
      {error}
      <div className="mt-3">
        {error !== 'User investment not found for this match' && (
          <Button variant="primary" onClick={() => navigate('/account')}>
            Go to Account to Redeem Coin
          </Button>
        )}
      </div>
    </Alert>
  );

  if (loading || userLoading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const renderLatestTips = () => (
    <div>
      <h2 className="fw-bold">Latest Tip</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table bordered hover className="table-striped align-middle shadow-sm">
        <thead className="table-dark">
            <tr>
            <th className='Runner'>Runner</th>
              <th className='Odds1'>Back Odds</th>
              <th className='Odds2' > Lay Odds</th>
              <th className='Amount1' >Back Amount</th>
              <th className='Amount2' >Lay Amount</th>
              <th className='Profit1' >Back Profit</th>
              <th className='Profit2'>Lay Profit</th>
            </tr>
          </thead>
        <tbody>
  {oddsHistory.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center">
        No latest odds available.
      </td>
    </tr>
  ) : error === 'Access denied: Please redeem a valid coin to view match odds and investment.' ? (
    renderError()
  ) : (
    oddsHistory.map((item, idx) => (
      <tr key={idx}>
        <td className='Runner'>{item.runnerName}</td>
        <td className={item.odds?.back ? 'Odds1' : ''}>{item.odds?.back ?? 0}</td>
        <td className={item.odds?.lay ? 'Odds2' : ''}>{item.odds?.lay ?? 0}</td>
        <td className={item.Ammount?.back ? 'Amount1' : ''}>{item.Ammount?.back ?? 0}</td>
        <td className={item.Ammount?.lay ? 'Amount2' : ''}>{item.Ammount?.lay ?? 0}</td>
        <td className={item.Profit?.back ? 'Profit1' : ''}>{item.Profit?.back ?? 0}</td>
        <td className={item.Profit?.lay ? 'Profit2' : ''}>{item.Profit?.lay ?? 0}</td>
      </tr>
    ))
  )}
</tbody>

        </Table>
      </div>
    </div>
  );

  const renderTipHistory = () => (
    <div>
      <h2 className="fw-bold">Tips History</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table bordered hover className="table-striped align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
            <th >Runner</th>
              <th >Back Odds</th>
              <th  > Lay Odds</th>
              <th  >Back Amount</th>
              <th  >Lay Amount</th>
              <th  >Back Profit</th>
              <th >Lay Profit</th>
            </tr>
          </thead>
          <tbody>
            {getFinalHistory().length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No tips history available.
                </td>
              </tr>
            ) : error === 'Access denied: Please redeem a valid coin to view match odds and investment.' ? (
              renderError()
            ) : (
              getFinalHistory().map((item, idx) => (
                <tr key={idx}>
                  <td >{item.runnerName}</td>
                  <td>{item.historyItem.odds?.back ?? 0}</td>
                  <td  >{item.historyItem.odds?.lay ?? 0}</td>
                  <td >{item.historyItem.Ammount?.back ?? 0}</td>
                  <td >{item.historyItem.Ammount?.lay ?? 0}</td>
                  <td >{item.historyItem.Profit?.back ?? 0}</td>
                  <td >{item.historyItem.Profit?.lay ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <AppLayout />
      <div className="container mt-5">
        {error && renderErrorMessage()}
        <div className="card p-3 mb-3">
          <h2 className="fw-bold">Add Opening Balance</h2>
          <Form onSubmit={handleInvestmentSubmit} className="mb-3">
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter Opening Amount"
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

       <div className="card shadow-sm mb-4">
          <div className="card-body">
            {match?.matchRunners?.length ? (
              <table className="table table-bordered table-colored">
                <thead>
                  <tr>
                    <th>Teams</th>
                    <th>Live Data</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {match.matchRunners.map((runner, index) => (
                        <span
                          key={index}
                          style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            marginRight: 8,
                          }}
                        >
                          {runner.runnerName}
                          {index < match.matchRunners.length - 1 ? ' vs ' : ''}
                        </span>
                      ))}
                    </td>
                    <td>Live Data Here</td>
                    <td>{new Date().toLocaleTimeString()}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <Alert variant="info">No teams available.</Alert>
            )}
          </div>
        </div>

        {renderLatestTips()}

        {eventId && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>Live Box</h4>
              {!iframeError ? (
                <div className="embed-responsive embed-responsive-16by9 position-relative">
                  {!iframeLoaded && (
                    <div
                      className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: '#f8f9fa', zIndex: 10 }}
                    >
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

        {renderTipHistory()}
      </div>
      <Footer />
    </>
  );
};

export default ViewTip;
