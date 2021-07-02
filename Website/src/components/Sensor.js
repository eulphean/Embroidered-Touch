// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

// import DatabaseParamStore from '../Stores/DatabaseParamStore';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    padding: padding.veryBig,
    zIndex: 2
  },

  info: {
    textAlign: 'center',
    zIndex: 'inherit'
  },

  title: {
    zIndex: 'inherit',
    fontWeight: 'bold'
  },

  button: {
    zIndex: 'inherit'
  }
};

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    let nextPath = this.getNextPath(); 
    return (
      <div style={styles.container}>
        <div style={styles.title}>Calibration</div>
        <br />
        <div style={styles.info}>First, the Left Sleeve.</div>
        <br />
        <div style={styles.info}>Starting with the vertical grid lines that run down the length of the sleeve, from shoulder to wrist.</div>
        <br />
        <div style={styles.info}>Touch the vertical grid line closest to the front of the body.</div>
        <br />
        <div style={styles.info}>Hold for about 3 seconds, then release.</div>
        <br />
        <div style={styles.info}>Then click NEXT below.</div>
        <CustomButton><RadiumLink to={nextPath}>NEXT</RadiumLink></CustomButton>    
      </div>
    );
  }

  // Logic to create the next path for the next button.
  getNextPath() {
    let path = ''; 
    let sensorIdx = this.props.sensorIdx < 11 ? this.props.sensorIdx : 0;
    if (this.props.chipsetId === 0 && this.props.sensorIdx < 11) {
      sensorIdx = sensorIdx + 1; 
      path = '/l-' + sensorIdx; 
    } else {
      // Right-0
      path = '/r-' + sensorIdx;
    }

    // Handle all the sensors from Right-0 onwards. 
    if (this.props.chipsetId === 1 && this.props.sensorIdx < 11) {
      sensorIdx = sensorIdx + 1; 
      path = '/r-' + sensorIdx;
    }

    // Last Right-11 path.
    if (this.props.chipsetId === 1 && this.props.sensorIdx === 11) {
      path = '/testcal'
    }
    return path; 
  }
}

export default Radium(Sensor);

// Chipset {this.props.chipsetId}
// <br />
// Sensor {this.props.sensorIdx}
// cutoffChange(e) {
//   let v = e.target.value; 
//   this.setState({
//       cutoffVal: Number(v)
//   });

//   DatabaseParamStore.setState(this.props.chipsetId, this.props.sensorIdx, v);
// }

// shouldComponentUpdate(nextProps, nextState) {
//     // // Be careful, no state changes will happen.
//     // if (this.props.fVal !== nextProps.fVal || 
//     //       this.props.bVal !== nextProps.bVal || 
//     //         this.props.configName !== nextProps.configName ||
//     //             this.state.cutoffVal !== nextState.cutoffVal) {
        
//     //     // Config has changed, so update the cut off value.
//     //     if (this.props.configName !== nextProps.configName) {
//     //       let newVal = DatabaseParamStore.getCutoffValue(nextProps.configName, this.props.chipsetId, this.props.sensorIdx); 
//     //       this.setState({
//     //         cutoffVal : newVal
//     //       });
//     //     }
//     //     return true; 
//     // } else {
//     //     return false; 
//     // }
// }


// <div>
// <span>{'Sensor Idx '}</span>{this.props.sensoridx}<span>{', Base Val: '}</span>{this.props.bVal}<span>{', Filtered Val: '}</span>{this.props.fVal}
// </div>
// <span>{'Cutoff Value: '}</span><input style={styles.input} onChange={this.cutoffChange.bind(this)} type="number" value={this.state.cutoffVal}></input>