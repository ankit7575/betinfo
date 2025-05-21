import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css'; // Import the CSS file

const Menu = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/account"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Account
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/keys"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Keys
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Transactions
          </NavLink>
        </li>
      </ul>

      <div className="logout">
        <NavLink to="/logout">Logout</NavLink>
      </div>
    </nav>
  );
};

export default Menu;
