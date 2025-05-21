import React from "react";
import './Keys.css';

const Keys = ({ user }) => {
  // Check if user and keys exist
  if (!user || !user.keys || user.keys.length === 0) {
    return <p>No keys available.</p>;
  }

  return (
    <div className="keys-container">
      <h2>Your Keys</h2>
      <table className="keys-table">
        <thead>
          <tr>
            <th>Key Code</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {user.keys.map((keyItem) => (
            <tr key={keyItem.id}>
              <td>{keyItem.shareableCode || 'N/A'}</td>
              <td>{keyItem.status || 'N/A'}</td>
              <td>{keyItem.createdAt?.$date ? new Date(keyItem.createdAt.$date).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Keys;
