import React from 'react';
import './Login.css';

const Account = ({ goBack }) => {

    return (
        <div className="sign-container">
            <h1>Account</h1>
            <p>Account component</p>
            <button className="sign-button" onClick={goBack}>Log Out</button>
        </div>
    );
};

export default Account;
