import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";

import Banner from "./section/Banner";
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
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
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
      <Banner />

      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Close Sidebar Menu" : "Open Sidebar Menu"}
      >
        {sidebarVisible ? "Close Menu" : "Open Menu"}
      </button>

      <div className={`account-container ${sidebarVisible ? "sidebar-open" : ""}`}>
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
