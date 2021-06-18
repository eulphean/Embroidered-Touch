// Name: ParamConfigs.js
// Author: Amay Kataria. 
// Date: 06/17/2021
// Description: Component to handle saving, loading, and updating the sensor params
// to the database. 

import React from 'react'
import Radium from 'radium'
import websocket from './Websocket'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px',
    marginTop: '20px'
  },

  configs : {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  textArea: {
    marginLeft: '10px',
    height: '15px'
  },

  sensor: {
    width: '30px',
    height: '20px',
    marginRight: '10px',
    marginTop: '10px'
  },

  button: {
    marginTop: '10px',
    marginRight: '10px'
  }
};

class ParamConfigs extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      configName: '',
      s1: 120,
      s2: 155,
      s3: 167
    };
  }

  render() {
    let o = this.getOptions();
    return (
      <div style={styles.container}>
        <div style={styles.configs}>
          <select>{o}</select>
          <textarea
            style={styles.textArea}
            value={this.state.configName}
            onChange={this.onTextAdded.bind(this)}
            placeholder={'Type config name'}
          />
        </div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={this.onLoad.bind(this)}>Load</button>
          <button style={styles.button} onClick={this.onSave.bind(this)}>Save</button>
          <button style={styles.button} onClick={this.onDelete.bind(this)}>Delete</button>
        </div>
        <div style={styles.sensorData}>
          <input onChange={this.s1Change.bind(this)} type="text" style={styles.sensor} value={this.state.s1} />
          <input onChange={this.s2Change.bind(this)} type="text" style={styles.sensor} value={this.state.s2} />
          <input onChange={this.s3Change.bind(this)} type="text" style={styles.sensor} value={this.state.s3} />
        </div>
      </div>
    );
  }

  onLoad() {
    let payload = {
      'name' : this.state.configName
    };

    websocket.loadUserConfig(payload, this.onDataLoaded.bind(this));
  }

  onSave() {
    // Use the websocket to emit this data to the backend. 
    // On the backend do a commit.

    // Websocket receives a callback.
    // And updates the options to the current config. 
    let payload = {
      'name': this.state.configName,
      's1' : this.state.s1,
      's2' : this.state.s2,
      's3' : this.state.s3
    }

    websocket.saveUserConfig(payload);
  }

  onDelete() {
    console.log('Delete');
  }

  s1Change(e) {
    this.setState({
      s1: e.target.value
    });
  }
  
  s2Change(e) {
    this.setState({
      s2: e.target.value
    });
  }

  s3Change(e) {
    this.setState({
      s3: e.target.value
    })
  }

  // Build this list dynamically. 
  // These options should be populated based on the database call. 
  getOptions() {
      let options = []; 
      options.push(<option key="new" value="new_config">New Config</option>);
      options.push(<option key="gallery" value='gallery'>Gallery</option>);
      options.push(<option key="studio" value='studio'>Studio</option>);
      return options; 
  }

  onTextAdded(e) {
    this.setState({
      configName: e.target.value
    });
  }

  onDataLoaded(d) {

  }
}

export default Radium(ParamConfigs);