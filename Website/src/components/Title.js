// Name: Title.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Title component for the app. 

import React from 'react'
import Radium from 'radium'

import { color, fontSize, padding } from './CommonStyles';
import { ReactComponent as Logout } from '../Assets/logout.svg'

const styles = {
  container: {
    position: 'relative',
    padding: padding.small,
    zIndex: 2
  },

  titleContainer: {
    textAlign: 'center',
    backgroundColor: color.tealBack,
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: color.black,
    padding: padding.verySmall,
    fontSize: fontSize.small,
    zIndex: 'inherit'
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: padding.small,
    color: color.white,
    fontSize: fontSize.verySmall,
    zIndex: 'inherit'
  },

  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 'inherit'
  },

  statusIcon: {
    backgroundColor: color.inactive,
    width: fontSize.small,
    height: fontSize.small,
    borderRadius: fontSize.small,
    zIndex: 'inherit'
  },

  statusText: {
    marginLeft: padding.verySmall
  },

  iconContainer: {
    fill: 'white',
    marginTop: padding.extraSmall,
    zIndex: 'inherit'
  },

  icon: {
    width: '15px',
    height: '15px',
    zIndex: 'inherit'
  },

  modeText: {
    marginRight: padding.verySmall
  },

  modeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 'inherit'
  }
};

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      mode: 'SETUP'
    };
  }

  // As soon as I click on Logout, I step out of the app. 
  render() {
    let mode = this.props.mode ? this.props.mode : this.state.mode; 
    let logout = this.props.showLogout ? this.getLogout() : React.Null;
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
            <div style={styles.modeContainer}>
              <div style={styles.modeText}>MODE: {mode}</div>
              { logout }
            </div>
        </div>
      </div>
    );
  }

  getLogout() {
    return (
      <div onClick={this.onLogout.bind(this)} style={styles.iconContainer}><Logout style={styles.icon}/></div>
    );
  }

  updateMode(newMode) {
    this.setState({
      mode: newMode
    })
  }

  onLogout(e) {
    e.preventDefault();
    if (this.props.onLogout) {
      this.props.onLogout();
    }
  }
}

export default Radium(Title);