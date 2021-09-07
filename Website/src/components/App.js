// Name: App.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Root class, which is the entry

import React from 'react'
import Radium from 'radium'
import { Redirect, HashRouter as Router, Route, Switch } from 'react-router-dom'

import StaticSleeve from './StaticSleeve.js'
import Title from './Title.js'
import Setup from './Setup.js'
import Login from './Login.js'
import Calibration from './Calibration.js'
import SelectMode from './SelectMode.js'
import TestCalibration from './TestCalibration.js'
import ConnectionMode from './ConnectionMode.js'
import Sensor from './Sensor.js'

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isConnected: false,
      receiveVal: 'Receive Text',
      isLoggedIn: false
    };
  }

  render() {
    let calibrationPages = this.getSensorCalibrationPages(); 
    let loginPage = this.state.isLoggedIn ? <Redirect to="/setup" /> : <React.Fragment><StaticSleeve /><Login onLogin={this.hasLoggedIn.bind(this)}/></React.Fragment>;
    // Redirect to test calibration page if we have already calibrated. 
    let setupPage = this.state.isLoggedIn ? <React.Fragment><StaticSleeve /><Setup /></React.Fragment> : <Redirect to="/" />; 
    let calibrationPage = this.state.isLoggedIn ? <React.Fragment><StaticSleeve /><Calibration /></React.Fragment> : <Redirect to="/" />
    let testCalPage = this.state.isLoggedIn ? <React.Fragment><TestCalibration /></React.Fragment> : <Redirect to="/" />;
    let selectModePage = this.state.isLoggedIn ? this.getSelectMode() : <Redirect to="/" />;
    let connectionModePage = this.state.isLoggedIn ? this.getConnectionMode() : <Redirect to="/" />;

    return (
      <div style={styles.container}>
        <Title onLogout={this.logOut.bind(this)} />
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              {calibrationPages}
              <Route path="/connection">{connectionModePage}</Route>
              <Route path="/selectmode">{selectModePage}</Route>
              <Route path="/testcal">{testCalPage}</Route>
              <Route path="/calibration">{calibrationPage}</Route>
              <Route path="/setup">{setupPage}</Route>
              <Route path="/">{loginPage}</Route>
            </Switch>
        </Router>
      </div>
    );
  }

  getConnectionMode() {
    return (
      <React.Fragment>
        <ConnectionMode />
      </React.Fragment>
    );
  }

  getSelectMode() {
    return (
      <React.Fragment>
        <SelectMode />
      </React.Fragment>
    );
  }

  getSensorCalibrationPages() {
    // Left sleeve....
    let pathPrefix = '/l-';
    let pages=[]; 
    for (let i=1; i <= 12; i++) {
      let path = pathPrefix + i; 
      let component = this.state.isLoggedIn ? (
        <React.Fragment>  
          <StaticSleeve 
            chipsetId={0}
            sensorIdx={i}
          />
          <Sensor 
            chipsetId={0}
            sensorIdx={i}
            key={'keyL:' + i}
          >
          </Sensor>
        </React.Fragment>
      ) : (<Redirect key={'l-' + i} to='/' />);

      let route = <Route key={'keyL:' + i} path={path}>{component}</Route>
      pages.push(route);
    }

    // Right sleeve....
    pathPrefix = '/r-'; 
    for (let i = 13; i <= 24; i++) {
      let path = pathPrefix + i; 
      let component = this.state.isLoggedIn ? (
        <React.Fragment>
          <StaticSleeve 
            chipsetId={1}
            sensorIdx={i}
          />
          <Sensor
            chipsetId={1}
            sensorIdx={i}
            key={'keyR:' + i}
          >
          </Sensor>
        </React.Fragment>
      ) : (<Redirect key={'r-' + i} to='/' />);

      let route = <Route key={'keyR:' + i} path={path}>{component}</Route>
      pages.push(route); 
    }

    return pages; 
  }

  hasLoggedIn(state) {
    this.setState({
      isLoggedIn: state
    });
  }

  logOut() {
    this.setState({
      isLoggedIn: false
    });
  }
}

export default Radium(App);