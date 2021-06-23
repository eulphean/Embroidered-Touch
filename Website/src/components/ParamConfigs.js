// Name: ParamConfigs.js
// Author: Amay Kataria. 
// Date: 06/17/2021
// Description: Component to handle saving, loading, and updating the sensor params
// to the database. 

import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import websocket from './Websocket'
import DatabaseParamStore from '../Stores/DatabaseParamStore.js'

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
      textValue: '',
      configNames: [],
      selectVal: 'newconfig', // Default value for the select box. 
    };

    this.selectRef = React.createRef();
  }

  componentDidMount() {
    // Subscribe to hear back from the store when data is fully loaded. 
    this.removeListener = DatabaseParamStore.subscribe(this.onConfigsLoaded.bind(this)); 
  }

  render() {
    let o = this.getOptions(); 
    return (
      <div style={styles.container}>
        <div style={styles.configs}>
          <select value={this.state.selectVal} ref={this.selectRef} onChange={this.onSelectChange.bind(this)}>{o}</select>
          <textarea
            style={styles.textArea}
            value={this.state.textValue}
            onChange={this.onTextAdded.bind(this)}
            placeholder={'Type config name..'}
          />
        </div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={this.onSave.bind(this)}>Save</button>
          <button style={styles.button} onClick={this.onDelete.bind(this)}>Delete</button>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // Remove this listener. 
    this.removeListener();
  }

  onSave() {
    // Current selected value. 
    let v = this.selectRef.current.value;    
    if (v === 'newconfig') {
      if (this.state.textValue.length > 0) {
        DatabaseParamStore.saveParams(this.state.textValue); 
        let new_config_names = this.state.configNames;

        // Add this new config created in the state. 
        new_config_names.push(this.state.textValue);
        this.setState({
          configNames: new_config_names,
          selectVal: this.state.textValue,
          textValue: ''
        });
      } else {
        // Maybe update the message box with this. 
        console.warn('Empty config name.'); 
      }
    } else {
      // We are doing an update / ignore the this.state.configName
      let configName = v; 
      DatabaseParamStore.updateParams(configName); 
    }
  }

  onDelete() {
    let configName = this.selectRef.current.value;
    websocket.deleteUserConfig(configName);

    let newConfigs = this.state.configNames; 
    // Remove this value from the array. 
    _.remove(newConfigs, (c) => {
      return configName === c;
    });

    this.setState({
      selectVal: 'newconfig',
      configNames: newConfigs
    });
  }

  onSelectChange(e) {
    let v = e.target.value; 

    if (v==='newconfig') {
      this.setState({
        selectVal: v
      });
      return;
    } else {
      let configs = this.state.configNames; 
      // Update sensor text boxes with 
      for (let i = 0; i < configs.length; i++) {
        let name = configs[i];
        if (name === v) {
          // Config found in this.
          // Assign the config to individual sensors. 
          // How will I do this???
          this.setState({
            selectVal: name
          });
          if (this.props.onConfigSelected) {
            this.props.onConfigSelected(name);
          }
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

      for (let i = 0; i < this.state.configNames.length; i++) {
        let name = this.state.configNames[i];
        options.push(<option key={name} value={name}>{name}</option>);
      }

      return options; 
  }

  onTextAdded(e) {
    this.setState({
      textValue: e.target.value
    });
  }

  onConfigsLoaded(fullConfigs) {
    let names = Object.keys(fullConfigs);
    this.setState({
      configNames: names
    }); 
  }
}

export default Radium(ParamConfigs);