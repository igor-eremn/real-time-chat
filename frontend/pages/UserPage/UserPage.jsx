import React, { useState } from 'react';
import '../basic-styling.css';
import './UserPage.css';
import Header from '../../components/header/Header';
import ReactCardFlip from 'react-card-flip';
import SignIn from '../../components/login/SignIn';
import SignUp from '../../components/login/SignUp';
import Account from '../../components/login/Account';

const UserPage = ({ setUser, logout, userId }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [toAccount, setToAccount] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpecialFlip = () => {
    setToAccount(true);
  };

  const goBackToSignIn = () => {
    setToAccount(false);
    setIsFlipped(false);
    setUser(null); // Clear user session on sign-out
  };

  // If userId is available, show Account page, otherwise show SignIn/SignUp
  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <div className="user-page-content">
          {userId ? (
            <Account goBack={goBackToSignIn} userId={userId} logout={logout} />
          ) : (
            <ReactCardFlip 
              isFlipped={isFlipped || toAccount}
              flipDirection="horizontal"
              flipSpeedBackToFront={1.5}
              flipSpeedFrontToBack={1.5}
            >
              {/* SignIn Form */}
              <div className="front-component">
                <SignIn 
                  flipFunc={handleClick} 
                  specialFlipFunc={handleSpecialFlip} 
                  setUserId={setUser}
                />
              </div>

              {/* SignUp Form */}
              <div className="back-component">
                <SignUp 
                  flipFunc={handleClick} 
                  specialFlipFunc={handleSpecialFlip} 
                  setUserId={setUser}
                />
              </div>
            </ReactCardFlip>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
