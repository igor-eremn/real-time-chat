import React from 'react';
import '../basic-styling.css';
import Header from '../../components/header/Header';

function HomePage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <h1>Home Page</h1>
        <p>Welcome to the ChatIT!</p>
        <p>Current features:</p>
        <p>- Login</p>
        <p>- Register</p>
        <p>- Account</p>
        <p>Future:</p>
        <p>- 1 Chat room</p>
        <p>- Join/Leave chat room</p>
        <p>- Send messages</p>
        <p>- Update account</p>
      </div>
    </div>
  );
}

export default HomePage;
