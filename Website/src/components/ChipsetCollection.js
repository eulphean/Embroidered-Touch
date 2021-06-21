// Name: ChipsetCollection.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Very simple wrapper class that holds all chipsets. 

import React from 'react'
import Radium from 'radium'
import Chipset from './Chipset'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
  }
};

class ChipsetCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
          <Chipset key='zero' chipsetId={0} />
          <Chipset key='one' chipsetId={1} />
      </div>
    );
  }
}

export default Radium(ChipsetCollection);