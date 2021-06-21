// Name: App.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Root class, which is the entry

import React from 'react'
import Radium from 'radium'

import ParamConfigs from './ParamConfigs.js'
import ble from './BLE.js'
import websocket from './Websocket.js'
import audio from './Audio.js'
import ChipsetCollection from './ChipsetCollection'

const styles = {
  container: {
    position: 'relative'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px'
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'row'
  },

  input:{
    width: '200px',
    marginTop: '10px',
    marginLeft: '10px'
  },

  connected: {
    backgroundColor: 'green'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isConnected: false,
      receiveVal: 'Receive Text'
    };
  }

  render() {
    let connectButtonStyle = this.state.isConnected ? [styles.input, styles.connected] : styles.input;

    return (
      <div style={styles.content}>
          <button onClick={this.onConnect.bind(this)}>BLE Connect</button>
          <button onClick={this.onDisconnect.bind(this)}>BLE Disconnect</button>
          <button onClick={this.onPlay.bind(this)}>Play Some Audio</button>
          <div style={styles.inputContainer}>
            <input onChange={this.onTextAdded.bind(this)} style={styles.input} type='text' placeholder='Transmit text.'></input>
            <div style={styles.input}>{this.state.receiveVal}</div>
          </div>
          <button style={connectButtonStyle} onClick={this.enableConnect.bind(this)}>Enable Connect</button>
          <ParamConfigs />
          <ChipsetCollection />
      </div>
    );
  }

  onConnect() {
    ble.connect();
  }

  onDisconnect() {
    ble.disconnect();
  }

  onPlay() {
    audio.play();
  }

  enableConnect() {
    this.setState({
      isConnected: !this.state.isConnected
    });

    websocket.updateRoom(this.onSensorDataReceived.bind(this));
  }

  onTextAdded(e) {
    let val = e.target.value; 
    websocket.broadcastText(val);
  }

  onSensorDataReceived(data) {
    console.log('Sensor Data received: ' + data);
    this.setState( {
      receiveVal: data
    });
  }
}

export default Radium(App);