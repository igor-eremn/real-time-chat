import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import './Login.css';

const Account = ({ goBack, userId }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    const handleSignOut = () => {
        console.log('User signed out successfully');
        goBack();
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${userId ? userId : ''}`);
                const data = await response.json();
                setUserInfo(data);
                setName(data.name);
                setUsername(data.username);
                setGender(data.gender);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserInfo();
    }, [userId]);

    return (
        <div className="sign-container">
            <h1>Account</h1>
            <div className={`user-icon ${gender.toLowerCase()}`}>
                <User size={48} />
            </div>
            <div className="user-info">
                <h2>{name}</h2>
                <p className="user-id">ID: {userId}</p>
            </div>
            <p>Username: {username}</p>
            <p>Gender: {gender}</p>
            <button className="sign-button" onClick={handleSignOut}>Log Out</button>
        </div>
    );
};

export default Account;