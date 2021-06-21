// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative'
  }
};

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };

    // Use the id from the props to create a collection of the sensor lines. 
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (this.props.fVal !== nextProps.fVal || this.props.bVal !== nextProps.bVal) {
          return true; 
      } else {
          return false; 
      }
  }

  render() {
    let content = 'Sensor ' + this.props.idx + ' : ' + 'Base Val: ' + this.props.bVal + ', Filtered Val: ' + this.props.fVal; 
    return (
      <div style={styles.container}>
        { content }
      </div>
    );
  }
}

export default Radium(Sensor);