// Name: Chipset.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Wrapper class for each chipset. 

import React from 'react'
import Radium from 'radium'
import Sensor from './Sensor'
import SensorDataStore  from '../Stores/SensorDataStore';

const styles = {
  container: {
    position: 'relative',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column'
  }
};

class Chipset extends React.Component {
  constructor(props) {
    super(props);

    // Use the chipset id to collect sensorData from the store. 
    this.state={
        chipData: SensorDataStore.getChipData(this.props.chipsetId),
        configName: ''
    };
  }

  componentDidMount() {
    this.removeListener = SensorDataStore.subscribe(this.handleNewSensorData.bind(this));
  }

  render() {
    let sensors = this.getSensors(); 
    let content = 'Chipset ' + this.props.chipsetId; 
    return (
      <div style={styles.container}>
        { content }
        { sensors } 
      </div>
    );
  }

  componentWillUnmount() {
      this.removeListener();
  }

  getSensors() {    
    // Gives an array of filtered values. 
    let fVals = this.state.chipData['f']; 
    let bVals = this.state.chipData['b'];
    let sensors = [];
    for (let i = 0; i < fVals.length; i++) {
        let s = (
            <Sensor 
                chipsetId={this.props.chipsetId}
                configName={this.state.configName}
                sensorIdx={i}
                fVal={fVals[i]} 
                bVal={bVals[i]}
                key={'key' + i}
            />
        );

        sensors.push(s); 
    }
    return sensors; 
  }

  handleNewSensorData(sensorData) {
    let data = sensorData[this.props.chipsetId];
    this.setState({
        chipData: data
    }); 
  }

  updateCalibrationParams(configName) {
    this.setState({
      configName: configName
    }); 
  }
}

export default Radium(Chipset);