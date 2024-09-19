import React, { useState } from 'react';
import './Login.css';

const SignUp = ({ flipFunc, specialFlipFunc, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const GoToSignIn = () => {
        flipFunc();
    };

    const handleSignUp = async () => {
        const newUserInfo = {
            username,
            name,
            password,
            gender
        };
        setUserInfo(newUserInfo);
    
        try {
            const response = await fetch('http://localhost:3000/users/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserInfo),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (response.status === 409) {
                    console.warn("Conflict: Username already exists");
                    setErrorMessage(data.message);
                    setError(true);
                    return false;
                } else if (response.status === 400) {
                    console.warn("Bad Request: Missing fields or invalid data");
                    setErrorMessage(data.message);
                    setError(true);
                    return false;
                } else {
                    console.warn(`Error ${response.status}: ${response.statusText}`);
                    setErrorMessage(data.message);
                    setError(true);
                    return false;
                }
            } else {
                console.log('User signed up successfully:', data);
                setErrorMessage("");
                setUserId(data.userId);
                setError(false);
                return true;
            }
        } catch (err) {
            console.warn('Error:', err);
            setError(true);
            setErrorMessage('Something went wrong. Please try again.');
            return false;
        }
    };

    const GoToAccount = async () => {
        const success = await handleSignUp();
        if (success) {
            setUsername('');
            setPassword('');
            setName('');
            setGender('');
            specialFlipFunc();
        }
    };

    return (
        <div className="sign-container">
            <h1>Sign Up</h1>
            <input
                type="text"
                placeholder="Username"
                className="input-field username-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="gender-selection">
                <label className="gender-label">
                    <input
                        type="checkbox"
                        className="gender-input"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                    />
                    <span className="custom-checkbox male"></span>
                    Male
                </label>
                <label className="gender-label">
                    <input
                        type="checkbox"
                        className="gender-input"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                    />
                    <span className="custom-checkbox female"></span>
                    Female
                </label>
            </div>
            <p className='error-message'>{errorMessage}</p>
            <button className="sign-button" onClick={GoToAccount}>Sign Up</button>
            <p className="alternative-action">
                Already have an account? <a onClick={GoToSignIn}>Sign In!</a>
            </p>
        </div>
    );
};

export default SignUp;