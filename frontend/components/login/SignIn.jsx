import React, { useState } from 'react';
import './Login.css';

const SignIn = ({ flipFunc, specialFlipFunc, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignIn = async () => {
        const loginCredentials = {
            username: username,
            password: password
        };
    
        try {
            const response = await fetch('http://localhost:3000/users/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginCredentials),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setErrorMessage(data.message || 'Login failed');
                return false;
            } else {
                console.log('User signed in successfully:', data);
                setUserId(data.userId);
                return true;
            }
        } catch (err) {
            setErrorMessage('An error occurred. Please try again.');
            return false;
        }
    };
    

    const GoToSignUp = () => {
        flipFunc();  // Regular flip
    };

    const GoToAccount = async () => {
        const success = await handleSignIn();

        if (success) {
            setUsername('');
            setPassword('');
            specialFlipFunc();
        }
    };

    return (
        <div className="sign-container">
            <h1>Sign In</h1>
            <input 
                type="text" 
                placeholder="Username" 
                className="input-field" 
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password" 
                className="input-field" 
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <p className='error-message'>{errorMessage}</p>
            <button className="sign-button" onClick={GoToAccount}>Sign In</button>
            <p className="alternative-action">
                Don't have an account? <a onClick={GoToSignUp}>Sign Up!</a>
            </p>
        </div>
    );
};

export default SignIn;
