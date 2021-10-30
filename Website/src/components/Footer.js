// Name: Footer.js
// Author: Amay Kataria. 
// Date: 10/30/2021
// Description: Adding a footer with credits on the website. 

import React from 'react'
import Radium from 'radium'
import { color, fontSize, padding } from './CommonStyles';

const styles = {
  container: {
    position: 'absolute',
    bottom: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    zIndex: 2,
    fontSize: fontSize.verySmall,
    paddingBottom: padding.verySmall
  },

  color: {
      color: color.sensorActive
  }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div>Website by <a style={styles.color} target='_blank'  rel="noopener noreferrer" href={'https://amaykataria.com'}>Amay Kataria</a> & <a style={styles.color} target='_blank' rel="noopener noreferrer" href='https://christineshallenberg.com/'>Christine Shallenberg</a></div>
        <div><a style={styles.color} target='_blank'  rel="noopener noreferrer" href={'http://ankeloh.net/'}>Anke Loh</a>, © 2021</div>
      </div>
    );
  }
}

export default Radium(Footer);


