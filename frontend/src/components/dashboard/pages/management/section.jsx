import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../../../actions/userAction";
import { Button, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";  // Import Helmet for managing head
import './section.css';

const Section = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.allUsers); // ✅ corrected

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [keyFilter, setKeyFilter] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(userId));
      dispatch(getAllUsers());
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setPhoneFilter('');
    setKeyFilter('');
  };

  const filteredUsers = users.filter((user) => {
    const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter ? user.role?.toLowerCase() === roleFilter.toLowerCase() : true;
    const phoneMatch = phoneFilter ? user.phoneNumber?.includes(phoneFilter) : true;
    const keyMatch = keyFilter ? user.keysAvailable?.toString().includes(keyFilter) : true;
    return emailMatch && roleMatch && phoneMatch && keyMatch;
  });

  return (
    <div className="admin-user-container">
      {/* Add Helmet for dynamic title */}
      <Helmet>
        <title>Manage Users - Admin</title>
      </Helmet>

      <h1>Manage Users</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Filter by Role</option>
          <option value="admin">Admin</option>
          <option value="referral">Referral</option>
          <option value="trader">Trader</option>
        </select>
        <input
          type="text"
          placeholder="Search by phone"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by keys"
          value={keyFilter}
          onChange={(e) => setKeyFilter(e.target.value)}
        />
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Keys Available</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.keysAvailable}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Section;
