import React from 'react';
import '../basic-styling.css';
import Header from '../../components/header/Header';

function UserPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <h1>User Page</h1>
        <p>Manage user details here.</p>
      </div>
    </div>
  );
}

export default UserPage;