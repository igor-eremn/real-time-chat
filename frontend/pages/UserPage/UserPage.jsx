import React from 'react';
import '../basic-styling.css';
import './UserPageStyle.css';
import Header from '../../components/header/Header';
import ReactCardFlip from 'react-card-flip';
import SignIn from '../../components/login/SignIn';
import SignUp from '../../components/login/SignUp';
import Account from '../../components/login/Account';

class UserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isFlipped: false,
      toAccount: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSpecialFlip = this.handleSpecialFlip.bind(this);
    this.goBackToSignIn = this.goBackToSignIn.bind(this);
  }

  handleClick() {
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  handleSpecialFlip() {
    this.setState({ toAccount: true });
  }

  goBackToSignIn() {
    this.setState({ toAccount: false, isFlipped: false });
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-content">
          <Header />
          <div className="user-page-content">
            <ReactCardFlip 
              isFlipped={this.state.isFlipped || this.state.toAccount}
              flipDirection="horizontal"
              flipSpeedBackToFront={1.5}
              flipSpeedFrontToBack={1.5}
            >
              {/* Front Component (SignIn) */}
              <div className="front-component">
                <SignIn flipFunc={this.handleClick} specialFlipFunc={this.handleSpecialFlip} />
              </div>

              {/* Back Component */}
              {this.state.toAccount ? (
                // Account component as "back-component-2"
                <div className="back-component-2">
                  <Account goBack={this.goBackToSignIn} />
                </div>
              ) : (
                // Regular SignUp component as back
                <div className="back-component">
                  <SignUp flipFunc={this.handleClick} specialFlipFunc={this.handleSpecialFlip} />
                </div>
              )}
            </ReactCardFlip>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
