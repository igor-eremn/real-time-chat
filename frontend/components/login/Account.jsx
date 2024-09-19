import React, { useState, useEffect } from 'react';
import './Login.css';

const Account = ({ goBack, userId }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${userId}`);
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
            <p>Account component</p>
            <p>User ID: {userId}</p>
            <p>User Name: {name}</p>
            <p>User username: {username}</p>
            <p>User gender: {gender}</p>
            <button className="sign-button" onClick={goBack}>Log Out</button>
        </div>
    );
};

export default Account;
