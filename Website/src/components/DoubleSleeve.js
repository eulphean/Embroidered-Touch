// Name: StaticSleeve.js
// Author: Amay Kataria. 
// Date: 07/01/2021
// Description: Double Sleeve component, which gets activated based on user interaction.

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Sleeve } from '../Assets/2sleeve_life.svg'

const lifeId = 'life'; 
const numbersId = 'numbers'; 

const styles = {
  svg: {
    width: '100%',
    height: '100%'
  },
};

class DoubleSleeve extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return (
      <div style={styles.svgContainer}>
        <Sleeve style={styles.svg} />
      </div>
    );
  }

  // To light up the lines, we must subscribe to the SensorDataStore
  // SensorDataStore will become the crux of this. 

  componentDidMount() {
    // Need to light up some lines. 
    if (this.props.showLife) {
       let numbers = document.getElementById(numbersId);
       numbers.style.visibility = 'hidden'; 
    } else {
      let life = document.getElementById(lifeId);
      life.style.visibility = 'hidden'; 
    }
  }
}

export default Radium(DoubleSleeve);