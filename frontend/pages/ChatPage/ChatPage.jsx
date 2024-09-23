import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/Header';
import './ChatPage.css';

const ChatPage = ({ userId }) => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        console.log('Chat ID from URL:', chatId);
        const fetchedMessages = [
            { id: 1, text: 'Hello' },
            { id: 2, text: 'How are you?' },
            { id: 3, text: 'I am fine, thanks!' },
            { id: 4, text: 'Hello' },
            { id: 5, text: 'How are you?' },
            { id: 6, text: 'I am fine, thanks!' },
            { id: 7, text: 'Hello' },
            { id: 8, text: 'How are you?' },
            { id: 9, text: 'I am fine, thanks!' },
            { id: 10, text: 'Hello' },
            { id: 11, text: 'How are you?' },
            { id: 12, text: 'I am fine, thanks!' },
            { id: 13, text: 'Hello' },
            { id: 14, text: 'How are you?' },
            { id: 15, text: 'I am fine, thanks!' },
        ];
        setMessages(fetchedMessages);
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
            setNewMessage("");
        }
    };

    return (
        <div className="chat-page-container">
            <Header />
            <div className="chat-content">
                <div className="messages-container">
                    {messages.map(message => (
                        <div key={message.id} className="message">
                            {message.text}
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
