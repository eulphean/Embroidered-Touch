// Name: Login.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that handles everything related to logging into the application. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
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
          LOGIN PAGE
      </div>
    );
  }
}

export default Radium(Login);