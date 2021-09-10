// Name: Login.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that handles everything related to logging into the application. 

import React from 'react'
import Radium from 'radium'
import { color, fontSize, padding } from './CommonStyles';

import DatabaseParamStore from '../Stores/DatabaseParamStore';
import Websocket from './Websocket';
import AppStatusStore from '../Stores/AppStatusStore';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: color.white,
    padding: padding.huge,
    zIndex: 2,
    '@media (min-width: 1200px)': {
      marginTop: padding.veryInsane
    }
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: padding.small,
    '@media (min-width: 1200px)': {
      marginTop: padding.veryBig
    }
  },

  button: {
    backgroundColor: color.tealBack,
    border: 'none',
    marginRight: padding.small,
    fontSize: fontSize.verySmall,
    color: color.white,
    padding: padding.verySmall,
    '@media (min-width: 1200px)': {
      fontSize: fontSize.big,
      padding: padding.small,
    }
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: padding.veryBig
  },

  input: {
    width: '100px',
    height: '20px',
    marginTop: padding.extraSmall,
    '@media (min-width: 1200px)': {
      width: '150px',
      height: '30px',
      fontSize: fontSize.big
    }
  },

  resultLabel: {
    marginTop: padding.extraSmall
  },

  loginText: {
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: '',
      message: ''
    };

    this.loginUrl = Websocket.loginURL; 
    this.signupURL = Websocket.signupURL;
    AppStatusStore.setShowLogout(false);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.loginText}>Login</div>
        <div style={styles.inputContainer}>
          <input style={styles.input} onChange={this.usernameChanged.bind(this)} type="text" placeholder="Username.." value={this.state.username}></input>
          <input style={styles.input} onChange={this.passwordChanged.bind(this)} type="password" placeholder="Password.." value={this.state.password}></input>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={this.onClickLogin.bind(this)}>ENTER</button>
          <button style={styles.button} onClick={this.onClickSignUp.bind(this)}>CREATE ACCOUNT</button>
        </div>
        <div style={styles.resultLabel}>
          {this.state.message}
        </div>
      </div>
    );
  }


  onClickLogin(e) {
    e.preventDefault(); 

    // Make a HTTP request. 
    const request = new Request(this.loginUrl, { method: 'POST', headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ username: this.state.username, password: this.state.password}) });

    fetch(request).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
              let result = data['result'];
              if (result === 'user_not_found') {
                this.props.onLogin(false, false); // Send back a token to decide if we should move forward. 
                this.setState({
                  message: 'Account not found'
                });
              } else if (result === 'user_found') {
                let configs = data['configs'];
                DatabaseParamStore.setConfig(configs); 
                this.props.onLogin(true); // Send back a token to decide if we should move forward.
              }
            });
            DatabaseParamStore.setConfigName(this.state.username);
        } else {
          console.error('Something wrong');
        }
      }).catch(error => {
          console.error(error);
      });
    }

    onClickSignUp(e) {
      e.preventDefault();

      // Make a post request with all these in a json
      let username = this.state.username;
      let password = this.state.password;

      // For first time sign up, this default config is sent to the DB. 
      let defaultConfigs = DatabaseParamStore.getDefaultJson(); 
      
      // Initial config is always sent as a HTTP request. 
      const request = new Request(this.signupURL, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ username: username, password: password, configs: defaultConfigs })});    
    
      fetch(request).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
              let result = data['result'];
              if (result === 'user_exists') {
                this.setState({
                  message: 'User Exists'
                });
              } else if (result === 'new_user') {
                this.setState({
                  message: 'New User Created'
                });
              }
            });
        } else {
          console.error('Something wrong');
        }
      }).then(response => {
          console.debug(response);
      }).catch(error => {
          console.error(error);
      });
    }

    usernameChanged(e) {
      let v = e.target.value; 
      this.setState({
        username: v
      });
    }

    passwordChanged(e) {
      let v = e.target.value; 
      this.setState({
        password: v
      });
    }
}

export default Radium(Login);


