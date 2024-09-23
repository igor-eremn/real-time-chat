import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import ChatCard from '../../components/chat-card/ChatCard';
import './ChatHomePage.css';

const ChatHomePage = ({ userId }) => {
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

  const handleChatCardClick = (chatId) => () => {
    console.log('Chat card clicked:', chatId);
    window.location.href = `/chat/${chatId}`;
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
              click={handleChatCardClick(chat._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatHomePage;