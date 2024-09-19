import React, { useState } from 'react';
import '../basic-styling.css';
import './UserPageStyle.css';
import Header from '../../components/header/Header';
import ReactCardFlip from 'react-card-flip';
import SignIn from '../../components/login/SignIn';
import SignUp from '../../components/login/SignUp';
import Account from '../../components/login/Account';

const UserPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [toAccount, setToAccount] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpecialFlip = () => {
    setToAccount(true);
  };

  const goBackToSignIn = () => {
    setToAccount(false);
    setIsFlipped(false);
    setUserId(null);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <Header />
        <div className="user-page-content">
          <ReactCardFlip 
            isFlipped={isFlipped || toAccount}
            flipDirection="horizontal"
            flipSpeedBackToFront={1.5}
            flipSpeedFrontToBack={1.5}
          >
            <div className="front-component">
              <SignIn flipFunc={handleClick} specialFlipFunc={handleSpecialFlip} setUserId={setUserId} />
            </div>

            {toAccount ? (
              <div className="back-component-2">
                <Account goBack={goBackToSignIn} userId={userId}/>
              </div>
            ) : (
              <div className="back-component">
                <SignUp flipFunc={handleClick} specialFlipFunc={handleSpecialFlip} setUserId={setUserId} />
              </div>
            )}
          </ReactCardFlip>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
