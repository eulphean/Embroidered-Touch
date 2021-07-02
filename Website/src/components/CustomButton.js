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
    fontSize: fontSize.small,
    color: color.white,
    padding: padding.small,
    letterSpacing: '1.5px'
  },

  buttonStatic: {
    backgroundColor: color.tealBack,
  },

  buttonActive: {
    backgroundColor: color.tealActive
  }
};

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    let buttonStyle = this.props.isActive ? [styles.button, styles.buttonActive] : [styles.button, styles.buttonStatic];
    return (
      <div style={styles.container}>
        <button onClick={this.props.onClick ? this.onClick.bind(this) : () => {}} style={buttonStyle}>
            {this.props.children}
        </button>
      </div>
    );
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClick(); 
  }
}

export default Radium(CustomButton);