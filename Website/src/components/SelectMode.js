// Name: SelectMode.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that allows one to switch between multiple modes. 

import React from 'react'
import Radium from 'radium'
import { color } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

const styles = {
  container: {
    position: 'relative',
    color: color.white
  },

  modeContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
};

class SelectMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div>MODE</div>
        <div style={styles.modeContainer}>
          <CustomButton>
            <RadiumLink>CONNECTION</RadiumLink>
          </CustomButton>
          <CustomButton>
            <RadiumLink>SOLO</RadiumLink>
          </CustomButton>
          <CustomButton>
            <RadiumLink to="/testcal">SETUP</RadiumLink>
          </CustomButton>
        </div>
      </div>
    );
  }
}

export default Radium(SelectMode);