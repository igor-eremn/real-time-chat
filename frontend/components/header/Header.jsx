import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file for styling

function Header() {
  return (
    <header className="header-container">
      <Link to="/" className="header-link">
        <h1 className="header-title">ChatIt</h1>
      </Link>
    </header>
  );
}

export default Header;
