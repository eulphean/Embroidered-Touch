// Name: Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that triggers calibration routine for the sensors. 

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
        CALIBRATION
        <CustomButton>
          <RadiumLink to="/l-0">CALIBRATE</RadiumLink>
        </CustomButton>
      </div>
    );
  }
}

export default Radium(Calibration);