// Name: Setup.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Bluetooth setup screen. 

import React from 'react'
import Radium from 'radium'
import { color, fontSize, padding } from './CommonStyles';
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
    fontWeight: 'bold',
    zIndex: 'inherit'
  },

  info: {
    zIndex: 'inherit',
    textAlign: 'center',
    zIndex: 2
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
        <div style={styles.title}>Initial Set-Up</div>
        <br />
        <div style={styles.info}>Start by attaching the battery.</div>
        <br />
        <div style={styles.info}>You should see the blue LED start to blink.</div>
        <br />
        <div style={styles.info}>Next put the shirt on and click PAIR below.</div>
        <br />
        <div style={styles.info}>Choose the Bluetooth device 'TOUCH' from the popup window and click 'PAIR'</div>
        <br /><br />
        <CustomButton><RadiumLink to='/calibration'>PAIR</RadiumLink></CustomButton>
      </div>
    );
  }

  onPair(e) {
    e.preventDefault();
  }
}

export default Radium(Setup);