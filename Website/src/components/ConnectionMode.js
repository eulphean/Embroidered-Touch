// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color } from './CommonStyles';

import SensorDataStore from '../Stores/SensorDataStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';

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
  }
};

class ConnectionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div style={styles.container}>
        <DoubleSleeve />
        <div style={styles.content}>
          <div style={styles.info}>Message Sent.</div> 
          <div style={styles.info}>Waiting for a friend to connect...</div>
        </div>
      </div>
    );
  }

}

export default Radium(ConnectionMode);