// Name: Setup.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Bluetooth setup screen. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
  }
};

class Setup extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

  }

  render() {
    return (
      <div style={styles.container}>
          SETUP PAGE
      </div>
    );
  }
}

export default Radium(Setup);