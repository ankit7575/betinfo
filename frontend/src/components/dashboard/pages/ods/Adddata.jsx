import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMatchById, addAdminBetfairOdds, getBetfairOddsForRunner } from '../../../../actions/matchaction';
import Layout from "../../layouts/layout";
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Adddata.css';
import BetfairMarketTable from '../../../../pages/sections/BetfairMarketTable';
import socket from '../../../../socket';

const Adddata = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [runnerOdds, setRunnerOdds] = useState([]);

  const { eventId } = location.state || {};
  const { match, loading } = useSelector((state) => state.match || {});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    runner: '',
    side: '',
    odd: '',
    amount: '',
  });

  useEffect(() => {
    if (eventId) {
      dispatch(getMatchById(eventId));
    } else {
      navigate('/');
    }
  }, [dispatch, eventId, navigate]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async ({tip}) => {
    setIsSubmitting(true);
    try {
      if (tip?.runner) {
        const data = {
          odds: {
            back: parseFloat(tip?.side === 'Back' ? tip?.odd : null),
            lay: parseFloat(tip?.side === 'Lay' ? tip?.odd : null),
          },
          Ammount: {
            back: parseFloat(tip?.side === 'Back' ? tip?.amount : null),
            lay: parseFloat(tip?.side === 'Lay' ? tip?.amount : null),
          },
        };
        await dispatch(addAdminBetfairOdds(eventId, tip?.runner, data));
      } else {
        const data = {
          odds: {
            back: parseFloat(formData?.side === 'Back' ? formData?.odd : null),
            lay: parseFloat(formData?.side === 'Lay' ? formData?.odd : null),
          },
          Ammount: {
            back: parseFloat(formData?.side === 'Back' ? formData?.amount : null),
            lay: parseFloat(formData?.side === 'Lay' ? formData?.amount : null),
          },
        };
        await dispatch(addAdminBetfairOdds(eventId, formData?.runner, data));
      }
      setFormData({
        runner: '',
        side: '',
        odd: '',
        amount: '',
      })
      await dispatch(getMatchById(eventId));
    } catch (error) {
      console.error("Error submitting all runners:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const handleOddsClick = async (tip) => {
    handleSubmit({tip: tip});
  }

  const getRunnerName = (selectionId, fallback, index) => {
    const matchData = match?.matchRunners?.find(r => r.selectionId === selectionId);
    return matchData?.runnerName || fallback || `Runner ${index + 1}`;
  };
  const latest = match?.adminBetfairOdds?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;
  return (
    <Layout userRole="admin">
      <Helmet>
        <title>Add Admin Tips - {match?.eventName || "Match"}</title>
      </Helmet>

      <div className="container mt-4">
        <h3 className="mb-3">{match?.eventName}</h3>

        <div>
          <BetfairMarketTable
            matchData={{
              eventId,
              market: { runners: runnerOdds },
              matchRunners: match?.matchRunners || [],
            }}
            handleSubmit={handleOddsClick}
            pnl={match?.netProfit ?? []}
            socket={socket}
          />
        </div>
        <div className='mt-4'>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="runner">
                  <Form.Label>Runner</Form.Label>
                  <Form.Select name="runner" value={formData.runner} onChange={handleChange}>
                    <option value="">Select an option</option>
                    {match?.matchRunners?.map((runner) => (<option key={runner.selectionId} value={runner.selectionId}>{getRunnerName(runner.selectionId)}</option>))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="side">
                  <Form.Label>Side</Form.Label>
                  <Form.Select name="side" value={formData.side} onChange={handleChange}>
                    <option value="">Select an option</option>
                    <option value="Back">Back</option>
                    <option value="Lay">Lay</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="odd">
                  <Form.Label>Odd</Form.Label>
                  <Form.Control
                    type="number"
                    name="odd"
                    value={formData.odd}
                    onChange={handleChange}
                    placeholder="Enter Odd"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button className='w-32' variant="primary" type="submit">{isSubmitting ? 'Submitting....' : 'Submit'}</Button>
          </Form>
        </div>

        <div className="latest-odds mt-4">
          <h4>Latest Tips</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Runner</th>
                <th>Side</th>
                <th>Odd</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {latest ? (
                <tr>
                  <td>{latest.runnerName}</td>
                  <td>{latest.odds?.back ? 'Back' : latest.odds?.lay ? 'Lay' : 'N/A'}</td>
                  <td>{latest.odds?.back ?? latest.odds?.lay ?? 'N/A'}</td>
                  <td>{latest.Ammount?.back ?? latest.Ammount?.lay ?? 'N/A'}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No runner data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="history-odds mt-4">
          <h4>Odds Tips</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Runner</th>
                <th>Side</th>
                <th>Odd</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {match?.adminBetfairOdds?.map((runnerOdds) =>
                runnerOdds.layingHistory?.map((history, index) => (
                  <tr key={index}>
                    <td>{runnerOdds.runnerName}</td>
                    <td>{history?.odds?.back ? 'Back' : history?.odds?.lay ? 'Lay' : 'N/A'}</td>
                    <td>{history?.odds?.back ?? history?.odds?.lay ?? 'N/A'}</td>
                    <td>{history?.Ammount?.back ?? history?.Ammount?.lay ?? 'N/A'}</td>
                    <td>{new Date(history.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Adddata;