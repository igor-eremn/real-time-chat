import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './ChatCard.css';

const ChatCard = ({ chatId, chatName, chatDescription, createdAt, participants, userId, click }) => {
    const [isUserParticipant, setIsUserParticipant] = useState(false);
    const [chatParticipants, setChatParticipants] = useState(participants);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        setIsUserParticipant(chatParticipants.includes(userId));
    }, [chatParticipants, userId]);

    const handleClick = async () => {
        click(chatId);
    };

    const handleJoinClick = async (e) => {
        e.stopPropagation();
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
        <div className="chat-card" onClick={handleClick}>
            <div className="chat-card-header" onClick={handleClick}>
                <h2 className="chat-card-title">{chatName}</h2>
                <div className="chat-card-info">
                    <span className="chat-card-date">
                        Made on: {format(new Date(createdAt), 'MMM d, yyyy')}
                    </span>
                    <span className="chat-card-participants">
                        Participants: {chatParticipants.length}
                    </span>
                </div>
            </div>
            <p className="chat-card-description">{chatDescription}</p>
            <div className="chat-card-footer" onClick={handleClick}>
                <button
                    className={`chat-card-button ${
                        isUserParticipant
                            ? 'chat-card-button-joined'
                            : 'chat-card-button-join'
                    }`}
                    onClick={!isUserParticipant && !isJoining ? handleJoinClick : null}
                    disabled={isUserParticipant || isJoining}
                >
                    {isUserParticipant ? 'Joined' : (isJoining ? 'Joining...' : 'Join')}
                </button>
            </div>
        </div>
    );
};

export default ChatCard;
