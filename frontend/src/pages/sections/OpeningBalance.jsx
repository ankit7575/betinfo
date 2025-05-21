import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import './OpeningBalance.css';

const predefinedAmounts = [1000, 5000, 10000, 15000, 100000];

const OpeningBalance = ({ investmentAmount, setInvestmentAmount, investmentLoading, handleSubmit }) => {
  const [customActive, setCustomActive] = useState(false);
  const [queuedSubmitAmount, setQueuedSubmitAmount] = useState(null);

  const handleBoxClick = (amount) => {
    setCustomActive(false);
    setQueuedSubmitAmount(amount);
    setInvestmentAmount(amount);
  };

  useEffect(() => {
    if (queuedSubmitAmount !== null && investmentAmount === queuedSubmitAmount) {
      handleSubmit({ preventDefault: () => {} });
      setQueuedSubmitAmount(null);
    }
  }, [investmentAmount, queuedSubmitAmount, handleSubmit]);

  return (
    <div className="card p-3 mb-3 bg-dark text-white border-0">
      <div className="row">
        <div className="col-1">
          <div className="bouncing-arrow">→</div>
        </div>
        <div className="col-11">
          <h2 className="fw-bold mb-3">Add Proposed Betting Amount</h2>

          <Row className="mb-3">
            {predefinedAmounts.map((amount, index) => (
              <Col xs={6} sm={4} md={2} className="mb-2" key={index}>
                <Button
                  className="w-100 animated-button"
                  onClick={() => handleBoxClick(amount)}
                  active={investmentAmount === amount}
                  disabled={investmentLoading}
                >
                  ₹{amount.toLocaleString()}
                </Button>
              </Col>
            ))}
            <Col xs={6} sm={4} md={2}>
              <Button
                className="w-100 animated-button"
                onClick={() => setCustomActive(true)}
                active={customActive}
                disabled={investmentLoading}
              >
                Custom
              </Button>
            </Col>
          </Row>

            <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter Custom Amount"
                value={investmentAmount}
                onChange={(e) => {
                  setInvestmentAmount(Number(e.target.value));
                  setCustomActive(true);
                }}
                disabled={investmentLoading}
              />
              <Button type="submit" variant="success" disabled={investmentLoading}>
                {investmentLoading ? 'Submitting...' : 'Add Opening Amount'}
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OpeningBalance;
