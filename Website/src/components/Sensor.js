// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'
import { color } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

// import DatabaseParamStore from '../Stores/DatabaseParamStore';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: color.white
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

  render() {
    let nextPath = this.getNextPath(); 
    return (
      <div style={styles.container}>
        Chipset {this.props.chipsetId}
        <br />
        Sensor {this.props.sensorIdx}
        <CustomButton>
          <RadiumLink to={nextPath}>NEXT</RadiumLink>
        </CustomButton>
      </div>
    );
  }

  getNextPath() {
    let path = ''; 
    let sensorIdx = this.props.sensorIdx < 11 ? this.props.sensorIdx : 0;
    if (this.props.chipsetId === 0 && this.props.sensorIdx < 11) {
      sensorIdx = sensorIdx + 1; 
      path = '/l-' + sensorIdx; 
      console.log(path);
    } else {
      sensorIdx = sensorIdx + 1; 
      path = '/r-' + sensorIdx;
      console.log(path);
    }

    if (this.props.chipsetId === 1 && this.props.sensorIdx === 11) {
      path = '/testcal'
    }

    return path; 
  }
}

export default Radium(Sensor);

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