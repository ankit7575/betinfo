import React from 'react';

const BalanceDisplay = ({ amount }) => (
  <div className="card p-3 mb-3">
    <h5>Proposed Betting Amount: {amount ?? 0}</h5>
  </div>
);

export default BalanceDisplay;
