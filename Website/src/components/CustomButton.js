// Name: CustomButton.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Custom Button component to give it our own style.

import React from 'react'
import Radium from 'radium'
import { color, fontSize, padding } from './CommonStyles.js'


const styles = {
  container: {
    zIndex: 2
  },

  button: {
    zIndex: 'inherit',
    border: 'none',
    marginTop: padding.small,
    backgroundColor: color.tealBack,
    fontSize: fontSize.small,
    color: color.white,
    padding: padding.small,
    letterSpacing: '1.5px'
  }
};

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <button style={styles.button}>
            {this.props.children}
        </button>
      </div>
    );
  }

  onClick() {
    this.props.onClick(); 
  }
}

export default Radium(CustomButton);