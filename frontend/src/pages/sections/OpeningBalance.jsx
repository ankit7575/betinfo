import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import './OpeningBalance.css';

const OpeningBalance = ({
  investmentAmount,
  setInvestmentAmount,
  investmentLoading,
  handleSubmit,
}) => {
  // OFF by default
  const [showAmountFields, setShowAmountFields] = useState(false);

  // Handle custom amount submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
    setShowAmountFields(false); // Turn off after submit
  };

  // Toggle ON/OFF
  const handleToggle = () => setShowAmountFields((prev) => !prev);

  return (
    <div className="card p-3 mb-3 bg-dark text-white border-0">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-3 headingnew m-0">Add Proposed Betting Amount</h2>
          <Button
            variant={showAmountFields ? "danger" : "success"}
            size="sm"
            className="ms-3"
            onClick={handleToggle}
          >
            {showAmountFields ? "Turn OFF" : "Turn ON"}
          </Button>
        </div>
        <div className="col-12 mt-3">
          {showAmountFields && (
            <Form onSubmit={handleFormSubmit}>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Custom Amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  disabled={investmentLoading}
                />
                <Button type="submit" variant="success" disabled={investmentLoading}>
                  {investmentLoading ? 'Submitting...' : 'Add Opening Amount'}
                </Button>
              </InputGroup>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningBalance;
