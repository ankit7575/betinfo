import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AccessSection.css";

const AccessSection = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const navigate = useNavigate();

  const handleDemoMode = () => {
    setIsDemoMode(true);
    navigate("/demo"); // Redirect to /demo page
  };

  return (
    <div className="access-container">
      <div className="access-card">
        <h2 className="access-heading">Welcome to <span>Betinfo.live</span></h2>
        <p className="access-message">
          {isDemoMode
            ? "You're currently exploring the platform in Demo Mode. Limited features enabled."
            : "Please log in or sign up to unlock full access."}
        </p>

        <div className="access-buttons">
          <button onClick={handleDemoMode} className="btn demo-btn">
            Try Demo Mode
          </button>

          {!isDemoMode && (
            <>
              <Link to="/login">
                <button className="btn login-btn">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn signup-btn">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessSection;
