import React from 'react';
import './Transactions.css';

const Transactions = ({ user }) => {
  if (!user || !user.transactions || user.transactions.length === 0) {
    return <p>No transactions available.</p>;
  }

  return (
    <div className="transactions-container">
      <h2>Wallet</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Wallet ID</th>
            <th>User ID</th>
            <th>Plan ID</th>
            <th>Status</th>
            <th>Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {user.transactions.map((transaction) => (
            <tr key={transaction._id?.$oid || transaction.transactionId}>
              <td data-label="Wallet ID">{transaction.transactionId}</td>
              <td data-label="User ID">{transaction.userId}</td>
              <td data-label="Plan ID">{transaction.plan?.$oid || 'N/A'}</td>
              <td data-label="Status">{transaction.status}</td>
              <td data-label="Transaction Date">
                {transaction.transactionDate?.$date
                  ? new Date(transaction.transactionDate.$date).toLocaleString()
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
