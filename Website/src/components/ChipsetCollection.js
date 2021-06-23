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

    this.chipset0Ref = React.createRef();
    this.chipset1Ref = React.createRef(); 
  }

  render() {
    return (
      <div style={styles.container}>
          <Chipset ref={this.chipset0Ref} key='zero' chipsetId={0} />
          <Chipset ref={this.chipset1Ref} key='one' chipsetId={1} />
      </div>
    );
  }

  updateCalibrationParams(configName) {
    this.chipset0Ref.current.updateCalibrationParams(configName);
    this.chipset1Ref.current.updateCalibrationParams(configName);
  }
}

export default Radium(ChipsetCollection);