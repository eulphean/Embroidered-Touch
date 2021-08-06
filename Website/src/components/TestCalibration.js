// Name: Test Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that renders the grid and makes it available to be tested. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Redirect } from 'react-router-dom';

import CustomButton from './CustomButton';
import DoubleSleeve from './DoubleSleeve';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import BLE from './BLE';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    padding: padding.extraSmall
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: padding.big
  },

  title: {
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  info: {
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  input: {
    width: fontSize.huge,
    height: fontSize.small,
    marginRight: padding.extraSmall,
    fontSize: fontSize.small,
    '@media (min-width: 1200px)': {
      width: fontSize.extraHuge,
      height: fontSize.huge,
      fontSize: fontSize.big
    }
  },

  button: {
    backgroundColor: color.tealBack,
    color: color.white,
    border: 'none',
    fontSize: fontSize.verySmall,
    padding: padding.extraSmall,
    '@media (min-width: 1200px)': {
      fontSize: fontSize.big,
      padding: padding.verySmall
    }
  }
};

class TestCalibration extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      sensorNum: '',
      redirectPath: ''
    };
  }

  render() {
    // Push a new path on to the history, so I can come back here. 
    if (this.state.redirectPath !== '') {
      return (<Redirect push to={this.state.redirectPath} />);
    } else {
      return (
        <div style={styles.container}>
          <DoubleSleeve showLife={false} />
          <div style={styles.content}>
            <div style={styles.title}>Testing Calibration</div>
            <br />
            <div style={styles.info}>The lines of the above grid should turn blue when a touch on the garment is detected.</div>
            <br />
            <div style={styles.info}>To adjust the calibration for a specific sensor line, enter the number for that sensor line below and click enter.</div>
            <br />
            <div style={styles.inputContainer}>
              <input style={styles.input} type='number' onChange={this.onInputChange.bind(this)} value={this.state.sensorNum}></input>
              <button onClick={this.onEnter.bind(this)} style={styles.button}>enter</button>
            </div>
            <br />
            <div style={styles.info}>When you are satisfied with the calibration, click SAVE below.</div><br />
            <CustomButton onClick={this.onSave.bind(this)}>SAVE</CustomButton>
          </div>
        </div>
      );
    }
  }

  onEnter(e) {
    e.preventDefault();
    // How do I navigate to the sensor line for calibration???
    let sensorNum = this.state.sensorNum; 
    let newPath = ''; 
    if (sensorNum >= 1 && sensorNum <= 12) {
      newPath = '/l-' + sensorNum;
    } else if (sensorNum >=13 && sensorNum <= 24) {
      newPath = '/r-' + sensorNum;
    }

    this.setState({
      redirectPath: newPath
    }); 
  }

  onSave() {
    DatabaseParamStore.commitConfig(); 
    this.setState({
      redirectPath: '/selectmode'
    });
  }

  onInputChange(e) {
    console.log(e.target.value);
    this.setState({
      sensorNum: e.target.value
    });
  }
}

export default Radium(TestCalibration);