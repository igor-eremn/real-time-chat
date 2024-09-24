import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';  // Import Socket.IO client
import Header from '../../components/header/Header';
import './ChatPage.css';
import { ArrowBigLeft, Info, BadgePlus, BadgeCheck, MessageCircleOff } from 'lucide-react';

const ChatPage = ({ userId }) => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();  // For the Back button navigation

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.emit('joinRoom', chatId);
        newSocket.on('messageReceived', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const fetchedMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3000/messages/chat/${chatId}`);
                if (!response.ok) {
                    console.log('Error fetching messages:', response.statusText);
                    return;
                }
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchedMessages();
    }, [chatId]);

    const handleSendMessage = async () => {
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
                            chatId: chatId,
                        })
                    });

                    if (!response.ok) {
                        console.error('Error posting message:', response.statusText);
                        return;
                    }

                    const savedMessage = await response.json();
                    if (socket) {
                        socket.emit('newMessage', savedMessage.newMessage);
                    }

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
            <div className="chat-menu">
                <div className="chat-menu-container">
                    <div className="chat-menu-section">
                        <button onClick={() => navigate(-1)} className="back-button"><ArrowBigLeft /></button>
                    </div>
                    <div className="chat-menu-section">
                        <h2 className="chat-name">Chat Name <Info /></h2>
                    </div>
                    <div className="chat-menu-section">
                        <button className="icon-button"><MessageCircleOff /></button>
                        <button className="icon-button"><BadgePlus /></button>
                    </div>
                </div>
            </div>
            <div className="chat-content">
                <div className="messages-container">
                    {messages.map(message => (
                        <div
                            key={message._id}
                            className={`message ${message.sender === userId ? 'message-sent' : 'message-received'}`}
                        >
                            {message.sender !== userId && (
                                <div className={`user-icon ${message.gender === 'male' ? 'blue-circle' : 'pink-circle'}`}></div>
                            )}
                            <div className="message-content">{message.messageContent}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="message-input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
