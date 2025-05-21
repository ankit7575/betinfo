import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMatchById, addAdminBetfairOdds } from '../../../../actions/matchaction';
import Layout from "../../layouts/layout";
import { Spinner, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Adddata.css';

const Adddata = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId } = location.state || {};
  const { match, loading } = useSelector((state) => state.match || {});

  const [runnerData, setRunnerData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(getMatchById(eventId));
    } else {
      navigate('/');
    }
  }, [dispatch, eventId, navigate]);

  useEffect(() => {
    if (match?.matchRunners) {
      const initialData = match.matchRunners.reduce((acc, runner) => {
        acc[runner.selectionId] = {
          odds: { back: '', lay: '' },
          Ammount: { back: '', lay: '' },
          Profit: { back: '', lay: '' }
        };
        return acc;
      }, {});
      setRunnerData(initialData);
    }
  }, [match]);

  const handleInputChange = (e, selectionId, field, type) => {
    setRunnerData((prevData) => ({
      ...prevData,
      [selectionId]: {
        ...prevData[selectionId],
        [field]: {
          ...prevData[selectionId][field],
          [type]: e.target.value,
        },
      },
    }));
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      for (const selectionId of Object.keys(runnerData)) {
        const { odds, Ammount, Profit } = runnerData[selectionId];
        const data = {
          odds: {
            back: odds?.back ? parseFloat(odds.back) : null,
            lay: odds?.lay ? parseFloat(odds.lay) : null,
          },
          Ammount: {
            back: Ammount?.back ? parseFloat(Ammount.back) : null,
            lay: Ammount?.lay ? parseFloat(Ammount.lay) : null,
          },
          Profit: {
            back: Profit?.back ? parseFloat(Profit.back) : null,
            lay: Profit?.lay ? parseFloat(Profit.lay) : null,
          },
        };
        await dispatch(addAdminBetfairOdds(eventId, selectionId, data));
      }
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

  return (
    <Layout userRole="admin">
      <Helmet>
        <title>Add Admin Tips - {match?.eventName || "Match"}</title>
      </Helmet>

      <div className="container mt-4">
        <h3 className="mb-3">{match?.eventName}</h3>

        <div className="row">
          {match?.matchRunners?.map((runner) => (
            <div key={runner.selectionId} className="col-lg-6 mb-4">
              <h5>{runner.runnerName}</h5>
              <Form>
                {["odds", "Ammount", "Profit"].map((field) => (
                  <React.Fragment key={field}>
                    <h6>{field}</h6>
                    <div className="d-flex">
                      {["back", "lay"].map((type) => (
                        <Form.Group className="mb-3 me-3" key={type}>
                          <Form.Label>{type.charAt(0).toUpperCase() + type.slice(1)}</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder={`${field} ${type}`}
                            value={runnerData[runner.selectionId]?.[field]?.[type] || ''}
                            onChange={(e) => handleInputChange(e, runner.selectionId, field, type)}
                          />
                        </Form.Group>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </Form>
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <Button variant="primary" onClick={handleSubmitAll} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit All Runners'}
          </Button>
        </div>

        <div className="latest-odds mt-4">
          <h4>Latest Tips</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Runner</th>
                <th>Odds Back</th>
                <th>Odds Lay</th>
                <th>Amount Back</th>
                <th>Amount Lay</th>
                <th>Profit Back</th>
                <th>Profit Lay</th>
              </tr>
            </thead>
            <tbody>
              {match?.adminBetfairOdds?.map((runnerOdds) => (
                <tr key={runnerOdds.selectionId}>
                  <td>{runnerOdds.runnerName}</td>
                  <td>{runnerOdds.odds?.back}</td>
                  <td>{runnerOdds.odds?.lay}</td>
                  <td>{runnerOdds.Ammount?.back || 'N/A'}</td>
                  <td>{runnerOdds.Ammount?.lay || 'N/A'}</td>
                  <td>{runnerOdds.Profit?.back || 'N/A'}</td>
                  <td>{runnerOdds.Profit?.lay || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="history-odds mt-4">
          <h4>Odds Tips</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Runner</th>
                <th>Odds Back</th>
                <th>Odds Lay</th>
                <th>Amount Back</th>
                <th>Amount Lay</th>
                <th>Profit Back</th>
                <th>Profit Lay</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {match?.adminBetfairOdds?.map((runnerOdds) =>
                runnerOdds.layingHistory?.map((history, index) => (
                  <tr key={index}>
                    <td>{runnerOdds.runnerName}</td>
                    <td>{history.odds?.back}</td>
                    <td>{history.odds?.lay}</td>
                    <td>{history.Ammount?.back || 'N/A'}</td>
                    <td>{history.Ammount?.lay || 'N/A'}</td>
                    <td>{history.Profit?.back || 'N/A'}</td>
                    <td>{history.Profit?.lay || 'N/A'}</td>
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