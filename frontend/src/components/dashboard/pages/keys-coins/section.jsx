import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersKeysAndCoins } from '../../../../actions/coinAction';
import { Table, Spinner, Alert, Badge, Button, Collapse, Form, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import './ViewUserKeysCoins.css';

const Section = () => {
  const dispatch = useDispatch();
  const { loading, error, allUserCoinsAndKeys } = useSelector((state) => state.coin || {});

  const [openRows, setOpenRows] = useState({}); // Track opened dropdowns
  const [filteredData, setFilteredData] = useState([]); // Filtered data state
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getAllUsersKeysAndCoins());
  }, [dispatch]);

  // Update filteredData whenever allUserCoinsAndKeys changes
  useEffect(() => {
    setFilteredData(allUserCoinsAndKeys); // Set filteredData initially to all data
  }, [allUserCoinsAndKeys]);

  const toggleRow = (idx) => {
    setOpenRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const applyFilters = useCallback(() => {
    let filtered = allUserCoinsAndKeys;

    if (emailFilter) {
      filtered = filtered.filter((user) =>
        user.userEmail.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((user) => {
        return user.coins.some((coin) => {
          if (statusFilter === 'Unused') {
            return !coin.usedAt;
          } else if (statusFilter === 'Used') {
            return coin.usedAt && !coin.isRedeemedRecently;
          } else if (statusFilter === 'Used (Last 24h)') {
            return coin.usedAt && coin.isRedeemedRecently;
          }
          return false;
        });
      });
    }

    setFilteredData(filtered); // Update the filtered data
  }, [emailFilter, statusFilter, allUserCoinsAndKeys]);

  // Reapply filters whenever email or status filter changes
  useEffect(() => {
    applyFilters();
  }, [emailFilter, statusFilter, applyFilters]);

  return (
    <div className="container-fluid view-keys-coins mt-4">
      <div className="row mb-3">
        <div className="col">
          <h2 className="fw-bold">🔑 User Keys & Coins</h2>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by Email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-md-4">
          <DropdownButton
            id="dropdown-status-filter"
            title={statusFilter || 'Filter by Status'}
            onSelect={handleStatusFilter}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Unused">Unused</Dropdown.Item>
            <Dropdown.Item eventKey="Used">Used</Dropdown.Item>
            <Dropdown.Item eventKey="Used (Last 24h)">Used (Last 24h)</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="text-center align-middle shadow-sm table-striped">
            <thead className="table-dark">
              <tr>
                <th>User Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData.map((user, idx) => (
                  <React.Fragment key={idx}>
                    <tr>
                      <td>{user.userEmail}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => toggleRow(idx)}
                          aria-expanded={openRows[idx]}
                        >
                          {openRows[idx] ? 'Hide Details' : 'View Details'}
                        </Button>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="2" className="p-0">
                        <Collapse in={openRows[idx]}>
                          <div>
                            <Table bordered size="sm" className="mb-0">
                              <thead className="table-secondary">
                                <tr>
                                  <th>Key</th>
                                  <th>Coin Code</th>
                                  <th>Status</th>
                                  <th>Used At</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(user.coins.length > 0 ? user.coins : [null]).map((coin, cIdx) => {
                                  const keyObj = user.keys?.[cIdx];
                                  if (!coin) {
                                    return (
                                      <tr key={cIdx}>
                                        <td colSpan="4" className="text-muted">No coins or keys found</td>
                                      </tr>
                                    );
                                  }

                                  return (
                                    <tr key={cIdx}>
                                      <td>{keyObj?.shareableCode || 'N/A'}</td>
                                      <td>{coin?.shareableCode}</td>
                                      <td>
                                        <Badge
                                          bg={coin.usedAt ? (coin.isRedeemedRecently ? 'success' : 'secondary') : 'warning'}
                                        >
                                          {coin.usedAt
                                            ? coin.isRedeemedRecently
                                              ? 'Used (Last 24h)'
                                              : 'Used'
                                            : 'Unused'}
                                        </Badge>
                                      </td>
                                      <td>{coin.usedAt ? new Date(coin.usedAt).toLocaleString() : '-'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-muted text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Section;
