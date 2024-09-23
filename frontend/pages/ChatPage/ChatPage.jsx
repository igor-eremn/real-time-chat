import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/Header';
import './ChatPage.css';

const ChatPage = ({ userId }) => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchedMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3000/messages/chat/${chatId}`);
                if (!response.ok) {
                    console.log('Error fetching messages:', response.statusText);
                    return;
                }
                const data = await response.json();
                console.log(data);
                setMessages(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchedMessages();
    }, [chatId]);

    const handleSendMessage = async () => {
        console.log(userId);
        if (userId === null) {
            window.location.href = '/user';
        } else {
            if (newMessage.trim()) {
                try {
                    const response = await fetch(`http://localhost:3000/messages/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            messageContent: newMessage,
                            sender: userId,
                            chatId: chatId
                        })
                    });
                    
                    if (!response.ok) {
                        console.error('Error posting message:', response.statusText);
                        return;
                    }
    
                    const savedMessage = await response.json();
                    setMessages([...messages, savedMessage]);
                    setNewMessage("");
                } catch (err) {
                    console.error('Error sending message:', err);
                }
            }
        }
    };
    

    return (
        <div className="chat-page-container">
            <Header />
            <div className="chat-content">
                <div className="messages-container">
                    {messages.map(message => (
                        <div key={message._id} className="message">
                            {message.messageContent}
                        </div>
                    ))}
                </div>
                <div className="message-input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                    />
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
