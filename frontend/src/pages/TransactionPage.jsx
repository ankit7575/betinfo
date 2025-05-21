import React from 'react';
import './TransactionPage.css'; // Import CSS file for styling

const TransactionPage = ({ user }) => {
  // Check if transactions exist in the user object
  if (!user || !user.transactions || user.transactions.length === 0) {
    return <p className="no-transactions">No transactions available.</p>;
  }

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Your Wallet</h2>
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
            <tr key={transaction._id.$oid}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.userId}</td>
              <td>{transaction.plan?.$oid || 'N/A'}</td> {/* Plan ID with optional chaining */}
              <td>{transaction.status}</td>
              <td>
                {transaction.transactionDate?.$date
                  ? new Date(transaction.transactionDate.$date).toLocaleString()
                  : '-'}
              </td> {/* Date formatting with optional chaining */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionPage;
