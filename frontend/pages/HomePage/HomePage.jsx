import React from 'react';
import '../basic-styling.css';
import Header from '../../components/header/Header';

function HomePage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
      </div>
    </div>
  );
}

export default HomePage;
