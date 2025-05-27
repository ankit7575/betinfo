import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";


import ProfileSection from "./section/ProfileSection";
import Keys from "./section/Keys";
import Coins from "./section/Coins";
import Transactions from "./section/Transactions";
import Plans from "./section/Plans";

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);

  const handleSectionChange = (section) => {
    setActiveSection(section.toLowerCase());
    setSidebarVisible(false); // close mobile sidebar
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const sections = [
    {
      key: "profile",
      label: "Profile",
      component: user ? <ProfileSection user={user} /> : <div>Loading...</div>,
    },
    {
      key: "keys",
      label: "Keys",
      component: user ? <Keys user={user} /> : <div>Loading...</div>,
    },
    {
      key: "coins",
      label: "Coins",
      component: user ? <Coins user={user} /> : <div>Loading...</div>,
    },
    {
      key: "transactions",
      label: "Transactions",
      component: user ? <Transactions user={user} /> : <div>Loading...</div>,
    },
    {
      key: "plans",
      label: "View Plans",
      component: <Plans />,
    },
  ];

  return (
    <div className="account-page">
    

      {/* Hamburger button for mobile */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarVisible(true)}
        aria-label="Open Account Menu"
      >
        <span className="mobile-hamburger-bar"></span>
        <span className="mobile-hamburger-bar"></span>
        <span className="mobile-hamburger-bar"></span>
      </button>

      <div className="account-container">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="account-sidebar">
          <h2>Account Menu</h2>
          <ul>
            {sections.map((item) => (
              <li
                key={item.key}
                className={activeSection === item.key ? "active" : ""}
                onClick={() => handleSectionChange(item.key)}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </li>
            ))}
            <li
              className="logout"
              onClick={handleLogout}
              aria-label="Log out of your account"
            >
              Logout
            </li>
          </ul>
        </aside>

        {/* --- MOBILE SIDEBAR --- */}
        <aside className={`account-sidebar-alt${sidebarVisible ? " show" : ""}`}>
        
          <h2>Account Menu</h2>
          <ul>
            {sections.map((item) => (
              <li
                key={item.key}
                className={activeSection === item.key ? "active" : ""}
                onClick={() => handleSectionChange(item.key)}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </li>
            ))}
            <li
              className="logout"
              onClick={handleLogout}
              aria-label="Log out of your account"
            >
              Logout
            </li>
          </ul>
        </aside>

        {/* Backdrop for mobile sidebar (absolute, not fixed) */}
        {sidebarVisible && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarVisible(false)}
          />
        )}

        <main className="account-main">
          {loading && <div>Loading user data...</div>}
          {error && <div className="error-message">Error: {error}</div>}
          {!loading &&
            !error &&
            sections.find((section) => section.key === activeSection)?.component}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
