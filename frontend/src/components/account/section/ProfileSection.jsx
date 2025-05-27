import React from "react";
import './ProfileSection.css';

const ProfileSection = ({ user }) => {
  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>
      <div className="profile-details">
        <table>
          <tbody>
            <tr>
              <td className="profile-label">Email:</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="profile-label">Phone Number:</td>
              <td>{user.phoneNumber}</td>
            </tr>
            <tr>
              <td className="profile-label">Status:</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileSection;
