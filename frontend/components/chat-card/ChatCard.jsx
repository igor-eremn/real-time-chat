import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './ChatCard.css';

const ChatCard = ({ chatId, chatName, chatDescription, createdAt, participants, userId }) => {
    const [isUserParticipant, setIsUserParticipant] = useState(false);
    const [chatParticipants, setChatParticipants] = useState(participants);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        setIsUserParticipant(chatParticipants.includes(userId));
    }, [chatParticipants, userId]);

    const handleClick = async () => {
        
        setIsJoining(true);
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatId}/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userId ? { userId } : {}),
            });

            const data = await response.json();
            setChatParticipants(data.participants);
        } catch (err) {
            console.error(err);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="chat-card">
            <div className="chat-card-header">
                <h2 className="chat-card-title">{chatName}</h2>
                <span className="chat-card-date">
                    {format(new Date(createdAt), 'MMM d, yyyy')}
                </span>
            </div>
            <p className="chat-card-description">{chatDescription}</p>
            <div className="chat-card-footer">
                <button
                    className={`chat-card-button ${
                        isUserParticipant
                            ? 'chat-card-button-joined'
                            : 'chat-card-button-join'
                    }`}
                    onClick={!isUserParticipant && !isJoining ? handleClick : null}
                    disabled={isUserParticipant || isJoining}
                >
                    {isUserParticipant ? 'Joined' : (isJoining ? 'Joining...' : 'Join')}
                </button>
            </div>
        </div>
    );
};

export default ChatCard;
