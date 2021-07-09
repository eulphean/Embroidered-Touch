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
    alignItems: 'center',
    color: color.white,
    padding: padding.huge,
    zIndex: 2
  },

  title: {
    zIndex: 'inherit',
    fontWeight: 'bold'
  },

  info: {
    zIndex: 'inherit',
    textAlign: 'center'
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
        <div style={styles.title}>Calibration</div>
        <br /><br />
        <div style={styles.info}>For calibration, you will be prompted to touch each of the grid lines one by one.</div>
        <br /><br /><div style={styles.info}>When you are ready to begin, click on CALIBRATE below.</div>
        <br /><br />
        <CustomButton>
          <RadiumLink to='/l-1'>CALIBRATE</RadiumLink>
        </CustomButton>
      </div>
    );
  }
}

export default Radium(Calibration);