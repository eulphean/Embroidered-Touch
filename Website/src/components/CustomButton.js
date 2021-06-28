// Name: CustomButton.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Custom Button component to give it our own style.

import React from 'react'
import Radium from 'radium'


const styles = {
  container: {
    position: 'relative',
  },

  button: {
    width: '125px',
    height: '35px'
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
        <button onClick={this.props.onClick ? this.onClick.bind(this) : () => {}}style={styles.button}>
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