import React from 'react';
import '../basic-styling.css';
import Header from '../../components/header/Header';

function SettingsPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <h1>Settings Page</h1>
        <p>Configure your settings here.</p>
      </div>
    </div>
  );
}

export default SettingsPage;
