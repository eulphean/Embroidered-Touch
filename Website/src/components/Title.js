// Name: Title.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Title component for the app. 

import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative',
    marginLeft: '10px'
  }
};

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

  }

  render() {
    return (
      <div style={styles.container}>
          TITLE COMPONENT
      </div>
    );
  }
}

export default Radium(Title);