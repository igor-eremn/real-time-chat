import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SideNavigation from '../components/navigation/SideNavigation.jsx';
import HomePage from '../pages/HomePage/HomePage.jsx';
import ChatPage from '../pages/ChatPage/ChatPage.jsx';
import SettingsPage from '../pages/SettingsPage/SettingsPage.jsx';
import UserPage from '../pages/UserPage/UserPage.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <SideNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/home"       element={<HomePage />} />
            <Route path="/chat"       element={<ChatPage />} />
            <Route path="/settings"   element={<SettingsPage />} />
            <Route path="/user"       element={<UserPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
