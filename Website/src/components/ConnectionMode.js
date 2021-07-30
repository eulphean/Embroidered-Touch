// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color, fontSize} from './CommonStyles';

import { ReactComponent as Ear } from '../Assets/ear.svg';
import AppStatusStore from '../Stores/AppStatusStore';
import Websocket from './Websocket';

const styles = {
  container: {
    color: color.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: '2%',
    paddingRight: '2%',
    '@media (min-width: 1200px)': {
      alignSelf: 'stretch',
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (min-width: 1200px)': {
      marginTop: '-25px'
    }
  },

  info: {
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },
  
  svgContainer: {
    width: '50%',
    height: '50%',
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      width: '75%',
      height: '75%'
    }
  },

  svg: {
    width: '50%',
    height: '50%'
  }
};

class ConnectionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      roomData: ''
    };
  }

  componentDidMount() {
    AppStatusStore.setMode('CONNECTION');
    Websocket.joinRoom(this.roomDataCallback.bind(this), this.sensorDataCallback.bind(this));
  }

  roomDataCallback(data) {
    this.setState({
      roomData: data
    }); 
  }

  sensorDataCallback(data) {
    console.log('Sensor Data Received'); 
  }

  componentWillUnmount() {
    AppStatusStore.setMode('SETUP');
    Websocket.leaveRoom(); 
  }

  render() {
    let message = this.getMessage(); 
    return (
      <div style={styles.container}>
        <DoubleSleeve />
        <div style={styles.content}>
          {message}
          <br /><br />
          <div style={styles.svgContainer}>
            <Ear style={styles.svg} />
          </div>
        </div>
      </div>
    );
  }

  getMessage() {
    let message = ''; 
    if (this.state.roomData === 'userJoined') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Message Sent.</div> 
          <div style={styles.info}>Waiting for a friend to connect...</div>
        </React.Fragment>
      );
    } else if (this.state.roomData === 'roomComplete') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Your friend is connected. You are now sending Embroidered Touch sound messages to them.</div> 
          <br /><br />
          <div style={styles.info}>You may also receive sound messages in response.</div>
        </React.Fragment>
      ); 
    } else if (this.state.roomData === 'userLeft') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Your friend has logged out.</div> 
        </React.Fragment>
      );
    }
    return message; 
  }

}

export default Radium(ConnectionMode);