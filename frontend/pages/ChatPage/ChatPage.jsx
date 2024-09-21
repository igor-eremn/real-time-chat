import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import ChatCard from '../../components/chat-card/ChatCard';
import './ChatPage.css';

const ChatPage = ({ userId }) => {
  const [chatsData, setChatsData] = useState([]);

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:3000/chats/');
      if (!response.ok) {
        console.log('Error fetching chats:', response.statusText);
        return;
      }
      const data = await response.json();
      setChatsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <div className="chat-grid">
          {chatsData.map((chat) => (
            <ChatCard
              key={chat._id}
              chatId={chat._id}
              chatName={chat.name}
              chatDescription={chat.description}
              createdAt={chat.createdAt}
              participants={chat.participants}
              userId={userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;