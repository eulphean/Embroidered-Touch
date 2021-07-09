// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color } from './CommonStyles';

import { ReactComponent as Ear } from '../Assets/ear.svg';
import SensorDataStore from '../Stores/SensorDataStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import AppStatusStore from '../Stores/AppStatusStore';

const styles = {
  container: {
    color: color.white
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  title: {
    fontWeight: 'bold'
  },

  svg: {
    width: '25%',
    height: '25%'
  }
};

class ConnectionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  componentDidMount() {
    AppStatusStore.setMode('CONNECTION'); 
  }

  componentWillUnmount() {
    AppStatusStore.setMode('SETUP');
  }

  render() {
    return (
      <div style={styles.container}>
        <DoubleSleeve />
        <div style={styles.content}>
          <div style={styles.info}>Message Sent.</div> 
          <div style={styles.info}>Waiting for a friend to connect...</div>
          <br /><br />
          <Ear style={styles.svg} />
        </div>
      </div>
    );
  }

}

export default Radium(ConnectionMode);