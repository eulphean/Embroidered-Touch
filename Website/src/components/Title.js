// Name: Title.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Title component for the app. 

import React from 'react'
import Radium from 'radium'

import { color, fontSize, padding } from './CommonStyles';
import { ReactComponent as Logout } from '../Assets/logout.svg'
import AppStatusStore from '../Stores/AppStatusStore';
import BLE from './BLE';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    position: 'relative',
    padding: padding.small,
    zIndex: 2,
    '@media (min-width: 1200px)': {
      padding: padding.lessBig
    }
  },

  titleContainer: {
    textAlign: 'center',
    backgroundColor: color.tealBack,
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: color.black,
    padding: padding.verySmall,
    fontSize: fontSize.small,
    zIndex: 'inherit',
    '@media (min-width: 1200px)': {
      padding: padding.lessBig,
      fontSize: fontSize.extraBig
    }
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: padding.small,
    color: color.white,
    zIndex: 'inherit',
    fontSize: fontSize.verySmall,
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 'inherit'
  },

  statusIcon: {
    width: fontSize.small,
    height: fontSize.small,
    borderRadius: fontSize.small,
    zIndex: 'inherit',
    '@media (min-width: 1200px)': {
      width: fontSize.big,
      height: fontSize.big
    }
  },

  statusIconInactive: {
    backgroundColor: color.inactive
  },

  statusIconActive: {
    backgroundColor: color.active
  },

  statusText: {
    marginLeft: padding.verySmall
  },

  iconContainer: {
    fill: 'white',
    zIndex: 'inherit',
    marginLeft: padding.verySmall,
    marginTop: padding.extraSmall,
    width: fontSize.small,
    '@media (min-width: 1200px)': {
      marginLeft: padding.small,
      width: fontSize.veryBig,
    }
  },

  icon: {
    width: '100%',
    height: '100%',
    zIndex: 'inherit'
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
    // Also subscribe to the store. 
    AppStatusStore.subscribe(this.onStatusUpdate.bind(this)); 
    let data = AppStatusStore.getData(); 
    this.state={
      mode: data['mode'],
      bleStatus: data['bleStatus'],
      showLogout: data['showLogout']
    };
  }

  // As soon as I click on Logout, I step out of the app. 
  render() {
    let logout = this.state.showLogout ? this.getLogout() : React.Null;
    let statusIconStyle = [styles.statusIcon, this.state.bleStatus ? styles.statusIconActive : styles.statusIconInactive];
    return (
      <div style={styles.container}>
        <div style={styles.titleContainer}>
            EMBROIDERED TOUCH
        </div>
        <div style={styles.infoContainer}>
            <div style={styles.statusContainer}>
              <div style={statusIconStyle}></div>
              <div style={styles.statusText}>BLUETOOTH STATUS</div>
            </div>
            <div style={styles.modeContainer}>
              <div>MODE: {this.state.mode}</div>
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

  onLogout(e) {
    e.preventDefault();
    if (this.props.onLogout) {
      this.props.onLogout();
    }
    BLE.disconnect();
  }

  onStatusUpdate() {
    let data = AppStatusStore.getData();
    this.setState({
      mode: data['mode'],
      bleStatus: data['bleStatus'],
      showLogout: data['showLogout']
    });
  }
}

export default Radium(Title);