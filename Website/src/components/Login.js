// Name: Login.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that handles everything related to logging into the application. 

import React from 'react'
import Radium from 'radium'
import { color, fontSize, padding } from './CommonStyles';

import DatabaseParamStore from '../Stores/DatabaseParamStore';
import Websocket from './Websocket';
import { ReactComponent as Sleeve } from '../Assets/1Sleeve.svg'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: color.white
  },

  loginContent: {
    zIndex: 2,
    padding: padding.huge
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: padding.small
  },

  button: {
    backgroundColor: color.tealBack,
    border: 'none',
    marginRight: padding.small,
    fontSize: fontSize.verySmall,
    height: fontSize.huge,
    color: color.white
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: padding.veryBig
  },

  input: {
    width: '100px',
    height: '20px',
    marginTop: padding.extraSmall
  },

  resultLabel: {
    marginTop: padding.extraSmall
  },


  loginText: {
    fontWeight: 'bold'
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
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.loginContent}>
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
      </div>
    );
  }

  componentDidMount() {
    // let line2 = document.getElementById('line2');
    // line2.style.stroke = 'red';
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
                this.props.onLogin(false); // Send back a token to decide if we should move forward. 
                this.setState({
                  message: 'Account not found'
                });
              } else if (result === 'user_found') {
                let config = data['config'];
                // console.log('Read config: ' + Object.keys(config));
                // Populate the store with this config. 
                this.props.onLogin(true); // Send back a token to decide if we should move forward.
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

    onClickSignUp(e) {
      e.preventDefault();

      // Make a post request with all these in a json
      let username = this.state.username;
      let password = this.state.password;
      let defaultConfig = DatabaseParamStore.getDefaultConfig(); 

      console.log(defaultConfig);
      
      // Make a HTTP request. 
      const request = new Request(this.signupURL, { method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ username: username, password: password, config: defaultConfig } ) });    
    
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


