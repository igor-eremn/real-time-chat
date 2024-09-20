import React, { useState } from 'react';
import { IoHome, IoChatbubble, IoSettings, IoPerson } from "react-icons/io5";
import { Link } from 'react-router-dom';
import './SideNavigation.css';

const SideNavigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const topMenuItems = [
    { icon: <IoHome size={24} />, label: 'Home', path: '/' },
    { icon: <IoChatbubble size={24} />, label: 'Chats', path: '/chat' },
  ];

  return (
    <div
      className={`side-navigation ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="burger-container">
        <div className={`burger ${isExpanded ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className="menu-container">
        <div className="menu-top">
          {topMenuItems.map((item, index) => (
            <Link key={index} to={item.path} className="menu-item">
              {item.icon}
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="menu-bottom">
          <Link to="/user" className="menu-item">
            <IoPerson size={24} />
            <span className="menu-label">User</span>
          </Link>
          <Link to="/settings" className="menu-item">
            <IoSettings size={24} />
            <span className="menu-label">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
