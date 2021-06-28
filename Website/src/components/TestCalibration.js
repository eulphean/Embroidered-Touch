// Name: Test Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that renders the grid and makes it available to be tested. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
  }
};

class TestCalibration extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

  }

  render() {
    return (
      <div style={styles.container}>
          Test Calibration
      </div>
    );
  }
}

export default Radium(TestCalibration);