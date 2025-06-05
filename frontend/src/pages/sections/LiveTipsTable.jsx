import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import { getMatchById, addAdminBetfairOdds, getBetfairOddsForRunner } from '../../actions/matchaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import BetfairMarketTable from './BetfairMarketTable';
import socket from '../../socket';
import './LiveTipsTable.css';

// Helper: Returns the correct team/runner name for a selectionId
function getTeamNameBySelectionId(selectionId, matchRunners, fallback, index) {
  const found = matchRunners?.find(
    r =>
      String(r.selectionId ?? r.runnerId) === String(selectionId)
  );
  return found?.runnerName || fallback || `Runner ${index + 1}`;
}

const LiveTipsTable = ({ eventId, isAdmin = false }) => {
  const dispatch = useDispatch();
  const { match, loading } = useSelector((state) => state.match || {});
  const [runnerOdds, setRunnerOdds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ runner: '', side: '', odd: '', amount: '' });

  useEffect(() => {
    if (eventId) dispatch(getMatchById(eventId));
  }, [dispatch, eventId]);
  useEffect(() => {
    if (eventId) {
      dispatch(getBetfairOddsForRunner(eventId)).then((result) => {
        if (result?.payload?.runners) setRunnerOdds(result.payload.runners);
        else setRunnerOdds([]);
      });
    }
  }, [dispatch, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData?.runner && formData?.side && formData?.odd && formData?.amount) {
        const data = {
          odds: {
            back: formData.side === 'Back' ? parseFloat(formData.odd) : null,
            lay: formData.side === 'Lay' ? parseFloat(formData.odd) : null,
          },
          Ammount: {
            back: formData.side === 'Back' ? parseFloat(formData.amount) : null,
            lay: formData.side === 'Lay' ? parseFloat(formData.amount) : null,
          }
        };
        await dispatch(addAdminBetfairOdds(eventId, formData.runner, data));
        setFormData({ runner: '', side: '', odd: '', amount: '' });
        await dispatch(getMatchById(eventId));
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // For one-click odds from BetfairMarketTable
  const handleOddsClick = async (tip) => {
    setIsSubmitting(true);
    try {
      const data = {
        odds: {
          back: tip?.side === 'Back' ? parseFloat(tip?.odd) : null,
          lay: tip?.side === 'Lay' ? parseFloat(tip?.odd) : null,
        },
        Ammount: {
          back: tip?.side === 'Back' ? parseFloat(tip?.amount) : null,
          lay: tip?.side === 'Lay' ? parseFloat(tip?.amount) : null,
        }
      };
      await dispatch(addAdminBetfairOdds(eventId, tip?.runner, data));
      await dispatch(getMatchById(eventId));
    } catch (error) {
      console.error("Error submitting from table:", error);
    } finally {
      setIsSubmitting(false);
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
      />

      {/* Tips Submission Form */}
      {isAdmin ? <Form className='mt-4' onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="runner">
              <Form.Label>Team</Form.Label>
              <Form.Select name="runner" value={formData.runner} onChange={handleChange}>
                <option value="">Select a team</option>
                {matchRunners.map((runner, idx) => (
                  <option key={runner.selectionId ?? runner.runnerId} value={runner.selectionId ?? runner.runnerId}>
                    {getTeamNameBySelectionId(runner.selectionId ?? runner.runnerId, matchRunners, runner.runnerName, idx)}
                  </option>
                ))}
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
        <Button className='w-32' variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form> : ''}

      {/* Latest Tips Table */}
      <div className="latest-odds mt-4 live-tips-scroll">
        <h4>Latest Tips</h4>
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

      {/* Odds Tips History Table */}
      <div className="history-odds mt-4 live-tips-scroll">
        <h4>Odds Tips History</h4>
        <table className="table table-bordered table-striped live-tips-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Side</th>
              <th>Odd</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {(match?.adminBetfairOdds || []).map((runnerOdds, idx) =>
              (runnerOdds.layingHistory || []).map((history, hIdx) => (
                <tr key={hIdx}>
                  <td className="Runner">{getTeamNameBySelectionId(runnerOdds.selectionId ?? runnerOdds.runnerId, matchRunners, runnerOdds.runnerName, idx)}</td>
                  <td>{history?.odds?.back ? 'Back' : history?.odds?.lay ? 'Lay' : 'N/A'}</td>
                  <td>{history?.odds?.back ?? history?.odds?.lay ?? 'N/A'}</td>
                  <td>{history?.Ammount?.back ?? history?.Ammount?.lay ?? 'N/A'}</td>
                  <td>{history?.timestamp ? new Date(history.timestamp).toLocaleString() : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveTipsTable;
