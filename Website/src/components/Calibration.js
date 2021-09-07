// Name: Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that triggers calibration routine for the sensors. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Link, Redirect } from 'react-router-dom';

import AppStatusStore from '../Stores/AppStatusStore';
import CustomButton from './CustomButton';
const RadiumLink = Radium(Link);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    padding: padding.huge,
    zIndex: 2,
    '@media (min-width: 1200px)': {
      marginTop: padding.extraEnormous
    }
  },

  title: {
    zIndex: 'inherit',
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  info: {
    zIndex: 'inherit',
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  }
};

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      redirectToPair: false
    };
  }
  
  componentDidMount() {
    this.appStoreRemover = AppStatusStore.subscribe(this.onAppStatusUpdated.bind(this));
  }

  componentWillUnmount() {
    this.appStoreRemover();
  }

  render() {
    return this.state.redirectToPair ? (<Redirect to={'/setup'} />) : (
      <div style={styles.container}>
        <div style={styles.title}>Calibration</div>
        <br /><br />
        <div style={styles.info}>For calibration, you will be prompted to touch<div>various areas on the sleeves with your hand.</div></div>
        <br /><br /><div style={styles.info}>When you are ready to begin,<div>click on CALIBRATE below.</div></div>
        <br /><br />
        <CustomButton>
          <RadiumLink to='/l-1'>CALIBRATE</RadiumLink>
        </CustomButton>
      </div>
    );
  }

  onAppStatusUpdated() {
    let data = AppStatusStore.getData();
    if (data['bleStatus'] === false) {
      // Component gets unmounted and cleans up its state.
      this.setState({
        redirectToPair: true
      });
    }
  }
}

export default Radium(Calibration);