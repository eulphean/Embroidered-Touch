// Name: Title.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Title component for the app. 

import React from 'react'
import Radium from 'radium'

import { color, fontSize, padding } from './CommonStyles';
import CustomButton from './CustomButton';

const styles = {
  container: {
    position: 'relative',
    padding: padding.small
  },

  titleContainer: {
    textAlign: 'center',
    backgroundColor: color.tealBack,
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: color.black,
    padding: padding.verySmall,
    fontSize: fontSize.small,
    zIndex: 2
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: padding.small,
    color: color.white,
    fontSize: fontSize.verySmall,
    zIndex: 2
  },

  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2
  },

  statusIcon: {
    backgroundColor: color.inactive,
    width: fontSize.small,
    height: fontSize.small,
    borderRadius: fontSize.small
  },

  statusText: {
    marginLeft: padding.verySmall
  },

  modeText: {
  }
};

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      mode: 'SETUP',
      shouldLogout: false
    };
  }

  // As soon as I click on Logout, I step out of the app. 
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.titleContainer}>
            EMBROIDERED TOUCH
        </div>
        <div style={styles.infoContainer}>
            <div style={styles.statusContainer}>
              <div style={styles.statusIcon}></div>
              <div style={styles.statusText}>BLUETOOTH STATUS</div>
            </div>
            <div style={styles.modeText}>
              MODE: {this.state.mode}
            </div>
        </div>
        {/* <button onClick={this.props.logout}>Logout</button> */}
      </div>
    );
  }
}

export default Radium(Title);