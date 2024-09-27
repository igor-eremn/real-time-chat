import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';  // Import Socket.IO client
import Header from '../../components/header/Header';
import './ChatPage.css';
import { ArrowBigLeft, Info, BadgePlus, BadgeCheck, MessageCircleOff } from 'lucide-react';
import ChatInfoModal from '../../components/modals/ChatInfoModal';

//TODO: add logs to chat: when somebody joins or leaves, different date

const ChatPage = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const messagesEndRef = useRef(null);

    const navigate = useNavigate();

    const { chatId } = useParams();
    const [chatInfo, setChatInfo] = useState(null);
    const [isUserParticipant, setIsUserParticipant] = useState(false);

    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
    const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);
    const [isModalHaveToJoinOpen, setIsModalHaveToJoinOpen] = useState(false);

    //joining chat room
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

    //scroll to bottom when new message is added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    //fetching messages when chat room is entered
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
                console.log(userId);
            } catch (err) {
                console.error(err);
            }
        };

        fetchedMessages();
        fetchChatInfo();
    }, [chatId]);

    useEffect(() => {
        if(chatInfo){
            setIsUserParticipant(chatInfo.participants.includes(userId));
            console.log(isUserParticipant);
        }
    }, [chatInfo]);

    const fetchChatInfo = async () => {
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatId}`);
            if (!response.ok) {
                console.log('Error fetching chat info:', response.statusText);
                return;
            }
            const data = await response.json();
            setChatInfo(data);
            return;
        } catch (err) {
            console.error(err);
        }
    };

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

    const handleLeaveChat = async () => {
        const removeMessages = async (userId) => {
            try {
                const response = await fetch(`http://localhost:3000/messages/chat/${chatId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to delete messages');
                }
                const result = await response.json();
                console.log(result.message);
                return result.success;
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        const removeParticipant = async (chatId, userId) => {
            try {
                const response = await fetch(`http://localhost:3000/chats/${chatId}/participants/${userId}`, {
                    method: 'DELETE',
                });
          
                if (!response.ok) {
                    throw new Error('Failed to remove participant');
                }
          
                const result = await response.json();
                console.log(result.message);
                return result.success;
            } catch (error) {
                console.error('Error:', error.message);
            }
        };
          

        let result_messages = await removeMessages(userId);
        let result_particapant = await removeParticipant(chatId, userId);
        handleCloseModal();
        if(result_messages && result_particapant) {
            navigate(-1);
        }
    };

    const handleInfoClick = () => {
        setIsModalInfoOpen(true);
    };

    const handleLeaveClick = () => {
        setIsModalLeaveOpen(true);
    };

    const handleHaveToJoinClick = () => {
        setIsModalHaveToJoinOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalInfoOpen(false);
        setIsModalHaveToJoinOpen(false);
        setIsModalLeaveOpen(false);
    };

    const handleJoinClick = async () => {
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatId}/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userId ? { userId } : {}),
            });
    
            const data = await response.json();
            fetchChatInfo();
            handleCloseModal();
        } catch (err) {
            console.error(err);
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
                        <h2 className="chat-name">{chatInfo ? chatInfo.name : ''}
                            <Info className="info-icon" onClick={handleInfoClick} />
                        </h2>
                    </div>
                    <div className="chat-menu-section">
                        <button className="icon-button">
                            {isUserParticipant ? 
                            <MessageCircleOff className="message-icon"
                                onClick={handleLeaveClick}
                            /> : ''}
                        </button>
                        <button className="icon-button">
                            {isUserParticipant ? 
                            <BadgeCheck className="check-icon"/> : 
                            <BadgePlus onClick={handleHaveToJoinClick}/>}
                        </button>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                isUserParticipant ? handleSendMessage() : handleHaveToJoinClick();
                            }
                        }}
                        
                    />
                    <button onClick={isUserParticipant ? handleSendMessage : handleHaveToJoinClick} className="send-button">Send</button>
                </div>
            </div>

            {/* Modals: Info, Leave, HaveToJoin */}
            <ChatInfoModal
                isVisible={isModalInfoOpen}
                onClose={handleCloseModal}
            >
                <h2>Name: {chatInfo ? chatInfo.name : ''}</h2>
                <p>Description: </p>
                <p>{chatInfo ? chatInfo.description : ''}</p>
                <p>Number of Participants: {chatInfo ? chatInfo.participants.length : '_'}</p>
                <p>Created: {chatInfo ? new Date(chatInfo.createdAt).toISOString().split('T')[0] : ''}</p>
            </ChatInfoModal>

            <ChatInfoModal
                isVisible={isModalLeaveOpen}
                onClose={handleCloseModal}
            >
                <h2>Do you want to leave the chat?</h2>
                <p>It will remove you from chat participants</p>
                <p>We will also clear all your messages</p>
                <p className="leave_text" onClick={handleLeaveChat}>{'> > > >  '}CLICK ME TO LEAVE {'  < < < <'}</p>
            </ChatInfoModal>

            <ChatInfoModal
                isVisible={isModalHaveToJoinOpen}
                onClose={handleCloseModal}
            >
                <h2>Do you want to join the chat?</h2>
                <p>You will be added to chat participants</p>
                <p>You will be able to send messages</p>
                <p className="join_text" onClick={handleJoinClick}>{'> > > >  '}CLICK ME TO JOIN {'  < < < <'}</p>
            </ChatInfoModal>
        </div>
    );
};

export default ChatPage;
