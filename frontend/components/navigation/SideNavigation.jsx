import React, { useState } from 'react';
import { IoHome, IoChatbubble, IoSettings, IoPerson } from "react-icons/io5";
import './SideNavigation.css';

const SideNavigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const topMenuItems = [
    { icon: <IoHome size={24} />, label: 'Home' },
    { icon: <IoChatbubble size={24} />, label: '1Room' },
    { icon: <IoChatbubble size={24} />, label: '2Room' },
    { icon: <IoChatbubble size={24} />, label: '3Room' },
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
            <div key={index} className="menu-item">
              {item.icon}
              <span className="menu-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="menu-bottom">
          <div className="menu-item">
            <IoPerson size={24} />
            <span className="menu-label">User</span>
          </div>
          <div className="menu-item">
            <IoSettings size={24} />
            <span className="menu-label">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
