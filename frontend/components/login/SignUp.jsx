import React from 'react';
import './Login.css';

const SignUp = ({ flipFunc, specialFlipFunc }) => {

    const GoToSignIn = () => {
        flipFunc();  // Regular flip
    };

    const GoToAccount = () => {
        specialFlipFunc();  // Special flip to Account
    };

    return (
        <div className="sign-container">
            <h1>Sign Up</h1>
            <input type="text" placeholder="Username" className="input-field" />
            <input type="email" placeholder="Email" className="input-field" />
            <input type="password" placeholder="Password" className="input-field" />
            <button className="sign-button" onClick={GoToAccount}>Sign Up</button>
            <p className="alternative-action">
                Already have an account? <a onClick={GoToSignIn}>Sign In!</a>
            </p>
        </div>
    );
};

export default SignUp;
