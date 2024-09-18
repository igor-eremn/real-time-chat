import React from 'react';
import './App.css';
import SideNavigation from '../components/navigation/SideNavigation.jsx';

function App() {
  return (
    <div className="app-container">
      <SideNavigation />
      <main className="main-content">
        <h1 className="title">Welcome to ChatIt</h1>
        <p>This is the main content area. Your chat interface will go here.</p>
      </main>
    </div>
  );
}

export default App;
