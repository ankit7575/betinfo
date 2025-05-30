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
          <h5 className="fw-bold   m-0">Add Amount</h5>
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
        <Form onSubmit={handleFormSubmit} className="ob-form">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Amount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              disabled={investmentLoading}
              className="ob-input"
              autoFocus
            />
            <Button
              type="submit"
              variant="success"
              disabled={investmentLoading}
              className="ob-submit-btn"
            >
              {investmentLoading ? '...' : 'Add'}
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
