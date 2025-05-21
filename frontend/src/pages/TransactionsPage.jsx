import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadUser } from '../actions/userAction';

import './Transactions.css'; // You can define styles for table and layout here

const TransactionsPage = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  const transactions = user?.transactions || [];

  return (
    <>
 
      <div className="transactions-container">
        <h2>Your Wallet</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
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
              {transactions.map((tx) => (
                <tr key={tx._id?.$oid || tx._id}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.userId}</td>
                  <td>{tx.plan?.$oid || 'N/A'}</td>
                  <td>{tx.status}</td>
                  <td>
                    {tx.transactionDate?.$date
                      ? new Date(tx.transactionDate.$date).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </>
  );
};

export default TransactionsPage;
