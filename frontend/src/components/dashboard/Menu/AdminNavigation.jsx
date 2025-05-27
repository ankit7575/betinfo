import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Navigation.css";

// 📌 Dropdown Component
function Dropdown({ category, options, isOpen, onToggle }) {
  return (
    <li className="menu-category">
      <div
        className="category-wrapper"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        aria-expanded={isOpen}
      >
        <div className={`category-inner-wrapper ${isOpen ? "category-selected" : ""}`}>
          <span className="category-title">
            {category} <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
          </span>
        </div>
      </div>
      {isOpen && (
        <ul className="subcategory-list">
          {options.map(({ name, link }, index) => (
            <li className="subcategory-item" key={index}>
              <Link to={link} className="subcategory-link">
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

Dropdown.propTypes = {
  category: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

// 📌 Main Admin Navigation Component
function AdminNavigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const toggleDropdown = useCallback((category) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // ✅ Final Navigation Menu with all dashboard routes
  const menuItems = [
    {
      category: "User Management",
      options: [
        { name: "View All Users", link: "/dashboard/management/view-users" },
      ],
    },
    {
      category: "Transactions",
      options: [
        { name: "View All Transactions", link: "/dashboard/transactions/view-all" },
      
      ],
    },
    {
      category: "Plans",
      options: [
        { name: "Plans", link: "/dashboard/plans/view-all" },
      ],
    },
    {
      category: "Keys & Coins",
      options: [
        { name: "View User Keys & Coins", link: "/dashboard/key/view-all-coin-user" },
      ],
    },
   {
  category: "Tips",
  options: [
    { name: "View Matches", link: "/dashboard/odds/view-matches" }
  ],
},

  ];

  return (
    <nav className="navbar">
      <ul className="menu">
        <h1 className="white pb-2 center">betinfo.live</h1>
        <li>
          <Link className="menu-item" to="/dashboard">Dashboard</Link>
        </li>

        {/* 🔽 Dropdowns */}
        {menuItems.map((menu, index) => (
          <Dropdown
            key={index}
            category={menu.category}
            options={menu.options}
            isOpen={isDropdownOpen[menu.category] || false}
            onToggle={() => toggleDropdown(menu.category)}
          />
        ))}

        {/* 🚪 Logout */}
        <li>
          <Link className="menu-item" to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavigation;
