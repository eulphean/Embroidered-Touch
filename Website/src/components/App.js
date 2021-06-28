// Name: App.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Root class, which is the entry

import React from 'react'
import Radium from 'radium'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import Title from './Title.js'
import Setup from './Setup.js'
import Login from './Login.js'
import Calibration from './Calibration.js'
import SelectMode from './SelectMode.js'
import TestCalibration from './TestCalibration.js'
import Sensor from './Sensor.js'

const styles = {
  container: {
    position: 'relative'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isConnected: false,
      receiveVal: 'Receive Text'
    };

    this.chipsetCollectionRef = React.createRef(); 
  }

  render() {
    let calibrationPages = this.getSensorCalibrationPages(); 
    return (
      <div style={styles.container}>
          <Router basename={process.env.PUBLIC_URL}> 
            <Switch>
              {calibrationPages}
              <Route path="/selectmode"><Title /><SelectMode /></Route>
              <Route path="/testcal"><Title /><TestCalibration /></Route>
              <Route path="/calibration"><Title /><Calibration /></Route>
              <Route path="/setup"><Title /><Setup /></Route>
              <Route path="/"><Title /><Login /></Route>
            </Switch>
        </Router>
      </div>
    );
  }

  getSensorCalibrationPages() {
    // Left sleeve....
    let pathPrefix = '/l-';
    let pages=[]; 
    for (let i=0; i < 12; i++) {
      let path = pathPrefix + i; 
      let route = (
        <Route key={'keyL:' + i} path={path}>
          <Title />
          <Sensor 
            chipsetId={0}
            sensorIdx={i}
            key={'keyL:' + i}
          >
          </Sensor>
        </Route>
      );

      pages.push(route);
    }

    // Right sleeve...
    pathPrefix = '/r-'; 
    for (let i = 0; i < 12; i++) {
      let path = pathPrefix + i; 
      let route = (
        <Route key={'keyR:' + i} path={path}>
          <Title />
          <Sensor
            chipsetId={1}
            sensorIdx={i}
            key={'keyR:' + i}
          >
          </Sensor>
        </Route>
      );
      pages.push(route); 
    }

    return pages; 
  }
}

export default Radium(App);

// import ble from './BLE.js'
// import websocket from './Websocket.js'
// import audio from './Audio.js'


// <Sensor 
// chipsetId={this.props.chipsetId}
// configName={this.state.configName}
// sensorIdx={i}
// fVal={fVals[i]} 
// bVal={bVals[i]}
// key={'key' + i}
// />


// <button onClick={this.onConnect.bind(this)}>BLE Connect</button>
// <button onClick={this.onDisconnect.bind(this)}>BLE Disconnect</button>
// <button onClick={this.onPlay.bind(this)}>Play Some Audio</button>
// <div style={styles.inputContainer}>
//   <input onChange={this.onTextAdded.bind(this)} style={styles.input} type='text' placeholder='Transmit text.'></input>
//   <div style={styles.input}>{this.state.receiveVal}</div>
// </div>
// <button style={connectButtonStyle} onClick={this.enableConnect.bind(this)}>Enable Connect</button>
// <ParamConfigs onConfigSelected={this.onConfigSelected.bind(this)} />
// <ChipsetCollection ref={this.chipsetCollectionRef} />

// onConnect() {
//   ble.connect();
// }

// onDisconnect() {
//   ble.disconnect();
// }

// onPlay() {
//   audio.play();
// }

// enableConnect() {
//   this.setState({
//     isConnected: !this.state.isConnected
//   });

//   websocket.updateRoom(this.onSensorDataReceived.bind(this));
// }

// onTextAdded(e) {
//   let val = e.target.value; 
//   websocket.broadcastText(val);
// }

// onSensorDataReceived(data) {
//   console.log('Sensor Data received: ' + data);
//   this.setState( {
//     receiveVal: data
//   });
// }

// onConfigSelected(configName) {
//   this.chipsetCollectionRef.current.updateCalibrationParams(configName); 
// }