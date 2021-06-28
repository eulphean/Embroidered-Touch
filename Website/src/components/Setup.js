// Name: Setup.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Bluetooth setup screen. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';

const RadiumLink = Radium(Link);

const styles = {
  container: {
    position: 'relative',
    color: color.white,
    padding: padding.big
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
        <div>Initial Set-Up</div>
        <CustomButton>
          <RadiumLink to='/calibration'>PAIR</RadiumLink>
        </CustomButton>
      </div>
    );
  }
}

export default Radium(Setup);