// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color, fontSize} from './CommonStyles';

import { ReactComponent as Ear } from '../Assets/ear.svg';
import SensorDataStore from '../Stores/SensorDataStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import AppStatusStore from '../Stores/AppStatusStore';

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
          <div style={styles.svgContainer}>
            <Ear style={styles.svg} />
          </div>
        </div>
      </div>
    );
  }

}

export default Radium(ConnectionMode);