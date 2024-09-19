import React from 'react';
import './Login.css';

const SignIn = ({ flipFunc, specialFlipFunc }) => {

    const GoToSignUp = () => {
        flipFunc();  // Regular flip
    };

    const GoToAccount = () => {
        specialFlipFunc();  // Special flip to Account
    };

    return (
        <div className="sign-container">
            <h1>Sign In</h1>
            <input type="text" placeholder="Username" className="input-field" />
            <input type="password" placeholder="Password" className="input-field" />
            <button className="sign-button" onClick={GoToAccount}>Sign In</button>
            <p className="alternative-action">
                Don't have an account? <a onClick={GoToSignUp}>Sign Up!</a>
            </p>
        </div>
    );
};

export default SignIn;
