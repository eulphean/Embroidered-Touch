// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'

import DatabaseParamStore from '../Stores/DatabaseParamStore';

const styles = {
  container: {
    position: 'relative'
  },

  input: {
      width: '40px',
      height: '20px',
      marginBottom: '10px',
      marginTop: '5px'
  }
};

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        // cutoffVal: DatabaseParamStore.getCutoffValue(this.props.configName, this.props.chipsetId, this.props.sensorIdx)
    };
  }

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

  render() {
    return (
      <div style={styles.container}>
        Chipset {this.props.chipsetId}
        <br />
        Sensor {this.props.sensorIdx}
      </div>
    );
  }

  // cutoffChange(e) {
  //   let v = e.target.value; 
  //   this.setState({
  //       cutoffVal: Number(v)
  //   });

  //   DatabaseParamStore.setState(this.props.chipsetId, this.props.sensorIdx, v);
  // }
}

export default Radium(Sensor);

// <div>
// <span>{'Sensor Idx '}</span>{this.props.sensoridx}<span>{', Base Val: '}</span>{this.props.bVal}<span>{', Filtered Val: '}</span>{this.props.fVal}
// </div>
// <span>{'Cutoff Value: '}</span><input style={styles.input} onChange={this.cutoffChange.bind(this)} type="number" value={this.state.cutoffVal}></input>