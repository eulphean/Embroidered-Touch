// Name: Title.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Title component for the app. 

import React from 'react'
import Radium from 'radium'

import { color, padding } from './CommonStyles';
import CustomButton from './CustomButton';

const styles = {
  container: {
    position: 'relative'
  },

  titleContainer: {
    display: 'flex',
    backgroundColor: color.tealBack,
    color: color.black,
    padding: padding.extraSmall
  }
};

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  // As soon as I click on Logout, I step out of the app. 
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.titleContainer}>
            EMBROIDERED TOUCH
        </div>
        <button onClick={this.props.logout}>Logout</button>
      </div>
    );
  }
}

export default Radium(Title);