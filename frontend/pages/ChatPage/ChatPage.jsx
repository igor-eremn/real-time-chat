import React from 'react';
import '../basic-styling.css';
import Header from '../../components/header/Header';

function ChatPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <h1>Chat Page</h1>
        <p>This is where the chat interface will go.</p>
      </div>
    </div>
  );
}

export default ChatPage;
