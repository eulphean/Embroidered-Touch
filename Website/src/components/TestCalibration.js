// Name: Test Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that renders the grid and makes it available to be tested. 

import React from 'react'
import Radium from 'radium'
import { color } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: color.white
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
        <div>
          Testing Calibration
        </div>
        <CustomButton>
          <RadiumLink to="/selectmode">SAVE</RadiumLink>
        </CustomButton>
      </div>
    );
  }
}

export default Radium(TestCalibration);