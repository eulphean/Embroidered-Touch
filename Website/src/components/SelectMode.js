// Name: SelectMode.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that allows one to switch between multiple modes. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
import { Link } from 'react-router-dom';

import DoubleSleeve from './DoubleSleeve';
import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

const styles = {
  container: {
    position: 'relative',
    color: color.white
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: padding.big,
    alignItems: 'center'
  },

  title: {
    fontWeight: 'bold'
  },

  info: {
    textAlign: 'center'
  }
};

class SelectMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isSoloActive: false
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <DoubleSleeve />
        <div style={styles.content}>
          <div style={styles.title}>Mode</div>
          <br />
          <div style={styles.info}>Choose SOLO to send sound to your own device.</div>
          <CustomButton isActive={this.state.isSoloActive} onClick={this.onClickSolo.bind(this)}>SOLO</CustomButton>
          <br />
          <div style={styles.info}>Choose CONNECTION to send and receive sound with a friend.</div>
          <CustomButton>
            <RadiumLink to='/connection'>CONNECTION</RadiumLink>
          </CustomButton>
          <br />
          <div style={styles.info}>Choose SETUP to recalibrate your device.</div>
          <CustomButton>
            <RadiumLink to="/testcal">SETUP</RadiumLink>
          </CustomButton>
        </div>
      </div>
    );
  }

  onClickSolo() {
    if (this.props.onClick) {
      // The new state will be opposite of what the current state is.
      if (this.state.isSoloActive) {
        this.props.onClick('SETUP');
      } else {
        this.props.onClick('SOLO');
      }

      // Activate.
      this.setState({
        isSoloActive: !this.state.isSoloActive
      });
    }
  }
}

export default Radium(SelectMode);