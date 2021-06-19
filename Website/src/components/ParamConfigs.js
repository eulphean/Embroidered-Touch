// Name: ParamConfigs.js
// Author: Amay Kataria. 
// Date: 06/17/2021
// Description: Component to handle saving, loading, and updating the sensor params
// to the database. 

import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
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
      configs: [],
      selectVal: 'newconfig', // Default value for the select box. 
      // TODO: This will be an array off all the sensor values.
      // This component will have to collect these from other components. 
      s1: '',
      s2: '',
      s3: ''
    };

    // Load user configs. 
    websocket.requestForConfigs(this.onAllConfigsLoaded.bind(this));
    this.selectRef = React.createRef();
  }

  render() {
    let o = this.getOptions(); 
    return (
      <div style={styles.container}>
        <div style={styles.configs}>
          <select value={this.state.selectVal} ref={this.selectRef} onChange={this.onSelectChange.bind(this)}>{o}</select>
          <textarea
            style={styles.textArea}
            value={this.state.configName}
            onChange={this.onTextAdded.bind(this)}
            placeholder={'Type config name'}
          />
        </div>
        <div style={styles.buttons}>
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

  onSave() {
    // Current selected value. 
    let v = this.selectRef.current.value;

    // Payload that goes to the database. 
    let payload = {}; 
    payload['s1'] = this.state.s1; 
    payload['s2'] = this.state.s2;
    payload['s3'] = this.state.s3; 
    
    // TODO: Check if this name already exists in the config. If it does,
    // Show an alert saying the name already exists... Or some message. 
    // somewhere. Maybe I need a message for the database commits. 
    // TODO: Show a message for a successful save to the db. 
    if (v === 'newconfig') {
      if (this.state.configName.length > 0) {
        payload['name'] = this.state.configName; 
        websocket.saveUserConfig(payload); 
        let new_configs = this.state.configs;
        new_configs.push(payload);
        this.setState({
          configs: new_configs,
          selectVal: payload['name'],
          configName: ''
        });
      } else {
        // Maybe update the message box with this. 
        console.warn('Empty config name.'); 
      }
    } else {
      // We are doing an update / ignore the this.state.configName
      payload['name'] = v; // Because value and name are same for entries added to the db.
      websocket.updateUserConfig(payload);
    }
  }

  onDelete() {
    let configName = this.selectRef.current.value;
    websocket.deleteUserConfig(configName);

    let newConfigs = this.state.configs; 
    // Remove this value from the array. 
    _.remove(newConfigs, (c) => {
      return configName === c['name'];
    });

    this.setState({
      selectVal: 'newconfig',
      s1: '',
      s2: '',
      s3: '',
      configs: newConfigs
    });

    // Remove the config from this collection. 
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

  onSelectChange(e) {
    let v = e.target.value; 

    if (v==='newconfig') {
      this.setState({
        selectVal: v
      });
      return;
    } else {
      let configs = this.state.configs; 
      // Update sensor text boxes with 
      for (let i = 0; i < configs.length; i++) {
        let name = configs[i]['name'];
        if (name === v) {
          let s1 = configs[i]['s1'];
          let s2 = configs[i]['s2'];
          let s3 = configs[i]['s3'];
          this.setState({
            selectVal: v,
            s1: s1,
            s2: s2,
            s3: s3
          });
          break;
        }
      }
    }
  }

  // Build this list dynamically. 
  // These options should be populated based on the database call. 
  getOptions() {
      let options = []; 
      // Blank option - always add by default.
      options.push(<option key="new" value="newconfig">newconfig</option>);

      for (let i = 0; i < this.state.configs.length; i++) {
        let name = this.state.configs[i]['name'];
        options.push(<option key={name} value={name}>{name}</option>);
      }

      return options; 
  }

  onTextAdded(e) {
    this.setState({
      configName: e.target.value
    });
  }

  onAllConfigsLoaded(d) {
    console.log('All configs loaded: ');
    this.setState({
      configs: d
    });
  }
}

export default Radium(ParamConfigs);


    // // Check if this config already exists. 
    // let configName = this.state.configName; 
    // let found = false; 
    // for (let i = 0; i < this.state.configs.length; i++) {
    //   let name = this.state.configs[i]['name'];
    //   if (name === configName) {
    //     found = true; 
    //     configName = name; 
    //     console.log('Found: ' + name);
    //     break;
    //   }
    // }