// Name: App.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Root class, which is the entry

import React from 'react'
import Radium from 'radium'

import ble from './BLE.js'
import websocket from './Websocket.js'

const styles = {
  container: {
    position: 'relative'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };
  }

  render() {
    return (
      <div>
          Hello I'm a simple content. 
          <button onClick={this.onClick.bind(this)}>Connect BLE</button>
      </div>
    );
  }

  onClick() {
    ble.connect();
    console.log('Hello click bluetooth connect');
  }
}

export default Radium(App);