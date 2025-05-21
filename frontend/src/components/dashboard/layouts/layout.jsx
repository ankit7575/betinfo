import React, { useState } from "react";
import PropTypes from "prop-types";
import AdminNavigation from "../Menu/AdminNavigation"; // Admin Dashboard Menu
import "./Layout.css"; // Import layout styles

const Layout = ({ children, userRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Determine which navigation menu to render based on `userRole`
  const renderNavigationMenu = () => {
    if (userRole === "admin") {
      return <AdminNavigation />;
    }
    return null; // No menu for non-admin users
  };

  return (
    <div className="layout">
      {/* Sidebar toggle button for mobile */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar containing the navigation menu */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {renderNavigationMenu()}
      </aside>

      {/* Main Content Area */}
      <main className="main-content">{children}</main>
    </div>
  );
};

// ✅ Add PropTypes validation for Layout component
Layout.propTypes = {
  children: PropTypes.node.isRequired, // `children` must be a valid React node
  userRole: PropTypes.string.isRequired, // `userRole` should be a string and required
};

export default Layout;
