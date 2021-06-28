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
    width: '150px',
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
        <button style={styles.button}>
            {this.props.children}
        </button>
      </div>
    );
  }
}

export default Radium(CustomButton);