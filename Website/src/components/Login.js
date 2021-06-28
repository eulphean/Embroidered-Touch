// Name: Login.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that handles everything related to logging into the application. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: color.white,
    padding: padding.big
  },

  title: {

  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
        <div style={styles.title}>
          LOGIN
        </div>
        <CustomButton>
          <RadiumLink to="/setup">Create Account</RadiumLink>
        </CustomButton>
        </div>
      </div>
    );
  }
}

export default Radium(Login);