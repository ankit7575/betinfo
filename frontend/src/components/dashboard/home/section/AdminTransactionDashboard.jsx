import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllUserTransactions,
  updateTransactionStatus,
} from '../../../../actions/transactionAction';
import { Table, Dropdown, Spinner, Alert } from 'react-bootstrap';
import './AdminTransactionDashboard.css'; // Custom styles

const AdminTransactionDashboard = () => {
  const dispatch = useDispatch();

  const { allTransactions = [], loading, error } = useSelector(
    (state) => state.transaction || {}
  );

  useEffect(() => {
    dispatch(getAllUserTransactions());
  }, [dispatch]);

  const handleStatusChange = (transactionId, newStatus) => {
    dispatch(updateTransactionStatus(transactionId, newStatus));
  };

  const flattenedTransactions = allTransactions.flatMap((userEntry) =>
    userEntry?.transactions?.length
      ? userEntry.transactions.map((tx) => ({
          ...tx,
          userEmail: userEntry.userId,
        }))
      : []
  );

  return (
    <div className="admin-transaction-dashboard container mt-4">
      <div className="dashboard-header d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Manage Transactions</h2>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && flattenedTransactions.length > 0 ? (
        <div className="table-responsive">
          <Table bordered hover className="text-center align-middle shadow-sm table-sm table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>User Email</th>
                <th>Plan</th>
                <th>Price</th>
                <th>Coins</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flattenedTransactions.map((tx, index) => (
                <tr key={tx.transactionId}>
                  <td>{index + 1}</td>
                  <td className="text-break">{tx.userEmail}</td>
                  <td>{tx.plan?.name || '-'}</td>
                  <td>${tx.plan?.price ?? '-'}</td>
                  <td>{tx.plan?.totalCoins ?? '-'}</td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        tx.status.toLowerCase() === 'pending'
                          ? 'bg-warning text-dark'
                          : tx.status.toLowerCase() === 'completed'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    {tx.transactionDate
                      ? new Date(tx.transactionDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle size="sm" variant="outline-primary">
                        Change
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            handleStatusChange(tx.transactionId, 'completed')
                          }
                        >
                          ✅ Mark as Completed
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleStatusChange(tx.transactionId, 'rejected')
                          }
                        >
                          ❌ Mark as Rejected
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        !loading && <p className="text-center text-muted">No transactions found.</p>
      )}
    </div>
  );
};

export default AdminTransactionDashboard;
