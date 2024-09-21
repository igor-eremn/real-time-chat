import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SideNavigation from '../components/navigation/SideNavigation.jsx';
import HomePage from '../pages/HomePage/HomePage.jsx';
import ChatPage from '../pages/ChatPage/ChatPage.jsx';
import SettingsPage from '../pages/SettingsPage/SettingsPage.jsx';
import UserPage from '../pages/UserPage/UserPage.jsx';

const App = () => {
  const [currentUserId, setCurrentUserId] = useState(() => {
    return sessionStorage.getItem('currentUserId');
  });

  const handleUserLogin = (userId) => {
    setCurrentUserId(userId);
    sessionStorage.setItem('currentUserId', userId);
  };

  const handleUserLogout = () => {
    setCurrentUserId(null);
    sessionStorage.removeItem('currentUserId');
  };

  return (
    <Router>
      <div className="app-container">
        <SideNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={
              <HomePage 
              />} 
            />
            <Route path="/home"       element={
              <HomePage 
              />} 
            />
            <Route path="/chat"       element={
              <ChatPage 
                userId={currentUserId} 
              />} 
            />
            <Route path="/settings"   element={
              <SettingsPage 
              />} 
            />
            <Route path="/user"       element={
              <UserPage 
                setUser={handleUserLogin} 
                logout={handleUserLogout} 
                userId={currentUserId}
              />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
