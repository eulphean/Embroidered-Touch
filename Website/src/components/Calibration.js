// Name: Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that triggers calibration routine for the sensors. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
  }
};

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

  }

  render() {
    return (
      <div style={styles.container}>
          CALIBRATION COMPONENT
      </div>
    );
  }
}

export default Radium(Calibration);