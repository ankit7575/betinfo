import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllUserTransactions,
  updateTransactionStatus,
} from '../../../../actions/transactionAction';
import { Table, Dropdown, Spinner, Alert, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet';  // Import Helmet for managing head
import './section.css'; // Custom styles

const Section = () => {
  const dispatch = useDispatch();

  const { allTransactions = [], loading, error } = useSelector(
    (state) => state.transaction || {}
  );

  // Filters
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');

  useEffect(() => {
    dispatch(getAllUserTransactions());
  }, [dispatch]);

  const handleStatusChange = (transactionId, newStatus) => {
    // If the status is "rejected", change it to "failed"
    if (newStatus === 'rejected') {
      newStatus = 'failed';
    }

    dispatch(updateTransactionStatus(transactionId, newStatus));
  };

  // Flattening all transactions
  const flattenedTransactions = allTransactions.flatMap((userEntry) =>
    userEntry?.transactions?.length
      ? userEntry.transactions.map((tx) => ({
          ...tx,
          userEmail: userEntry.userId,
        }))
      : []
  );

  // Apply filters
  const filteredTransactions = flattenedTransactions.filter((tx) => {
    const statusMatch =
      transactionStatusFilter !== '' ? tx.status.toLowerCase() === transactionStatusFilter.toLowerCase() : true;
    const planMatch =
      planFilter !== '' ? tx.plan?.name.toLowerCase().includes(planFilter.toLowerCase()) : true;
    const emailMatch =
      emailFilter !== '' ? tx.userEmail.toLowerCase().includes(emailFilter.toLowerCase()) : true;

    return statusMatch && planMatch && emailMatch;
  });

  return (
    <div className="admin-transaction-dashboard container mt-4">
      {/* Add Helmet for dynamic title */}
      <Helmet>
        <title>Manage Transactions - Admin</title>
      </Helmet>

      <div className="dashboard-header d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Manage Transactions</h2>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter Section */}
      <div className="filter-section mb-4">
        <Form.Control
          type="text"
          placeholder="Search by Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          type="text"
          placeholder="Search by Plan Name"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          as="select"
          value={transactionStatusFilter}
          onChange={(e) => setTransactionStatusFilter(e.target.value)}
          className="mb-2"
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </Form.Control>
      </div>

      {!loading && filteredTransactions.length > 0 ? (
        <div className="table-responsive">
          <Table bordered hover className="text-center align-middle shadow-sm table-sm table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
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
              {filteredTransactions.map((tx, index) => (
                <tr key={tx.transactionId}>
                  <td>{index + 1}</td>
                  <td>{tx.transactionId}</td>
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

export default Section;
