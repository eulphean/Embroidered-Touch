// Name: Test Calibration.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that renders the grid and makes it available to be tested. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Redirect } from 'react-router-dom';

import AppStatusStore from '../Stores/AppStatusStore';
import CustomButton from './CustomButton';
import DoubleSleeve from './DoubleSleeve';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import ProductStore, { PRODUCT } from '../Stores/ProductStore';
import ChildSleeve from './ChildSleeve';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    padding: padding.extraSmall
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: padding.big,
    zIndex: 2
  },

  title: {
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  info: {
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  input: {
    width: fontSize.huge,
    height: fontSize.small,
    marginRight: padding.extraSmall,
    fontSize: fontSize.small,
    '@media (min-width: 1200px)': {
      width: fontSize.extraHuge,
      height: fontSize.huge,
      fontSize: fontSize.big
    }
  },

  button: {
    backgroundColor: color.tealBack,
    color: color.white,
    border: 'none',
    fontSize: fontSize.verySmall,
    padding: padding.extraSmall,
    '@media (min-width: 1200px)': {
      fontSize: fontSize.big,
      padding: padding.verySmall
    }
  }
};

class TestCalibration extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      sensorNum: '',
      redirectPath: '',
      redirectToPair: false,
      curProduct: ProductStore.getProductName()
    };
  }

  componentDidMount() {
    let config = JSON.stringify(DatabaseParamStore.getConfigJson(this.state.curProduct));
    console.log("Config: " + config);
    this.appStoreRemover = AppStatusStore.subscribe(this.onAppStatusUpdated.bind(this));
    this.productStoreRemover = ProductStore.subscribe(this.onProductChanged.bind(this)); 
  }

  componentWillUnmount() {
    // Remove the app status store subscription.
    this.appStoreRemover();
    this.productStoreRemover(); 
  }

  render() {
    let sleeve = this.getSleeve(); 
    if (this.state.redirectToPair) {
      return (<Redirect to="/setup" />);
    } else if (this.state.redirectPath !== '') { // Push a new path on to the history, so I can come back here. 
      return (<Redirect push to={this.state.redirectPath} />);
    } else {
      return (
        <div style={styles.container}>
          {sleeve}
          <div style={styles.content}>
            <div style={styles.title}>Testing Calibration</div>
            <br />
            <div style={styles.info}>The lines of the above grid should turn blue when a touch on the garment is detected.</div>
            <br />
            <div style={styles.info}>To adjust the calibration for a specific sensor line, enter the number for that sensor line below and click enter.</div>
            <div style={styles.info}>After you are finished calibrating that sensor line, hit the BACK button on the browser.</div>
            <br />
            <div style={styles.inputContainer}>
              <input style={styles.input} type='number' onChange={this.onInputChange.bind(this)} value={this.state.sensorNum}></input>
              <button onClick={this.onEnter.bind(this)} style={styles.button}>enter</button>
            </div>
            <br />
            <div style={styles.info}>When you are satisfied with the calibration, click SAVE below.</div><br />
            <CustomButton onClick={this.onSave.bind(this)}>SAVE</CustomButton>
          </div>
        </div>
      );
    }
  }

  onProductChanged(newProduct) {
    this.setState({
      curProduct: newProduct
    }); 
  }

  getSleeve() {
    if (this.state.curProduct === PRODUCT.SWEATER) {
      return (<DoubleSleeve showLife={false} />); 
    } else if (this.state.curProduct === PRODUCT.CHILDA) {
      return (<ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={true} isChildA={true} />); 
    } else if (this.state.curProduct === PRODUCT.CHILDB) {
      return (<ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={true} isChildA={false} />); 
    }
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

  onEnter(e) {
    e.preventDefault();
    // How do I navigate to the sensor line for calibration???
    let sensorNum = this.state.sensorNum; 
    let newPath = ''; 

    if (this.state.curProduct === PRODUCT.SWEATER) {
      if (sensorNum >= 1 && sensorNum <= 12) {
        newPath = '/l-' + sensorNum;
      } else if (sensorNum >=13 && sensorNum <= 24) {
        newPath = '/r-' + sensorNum;
      }
    } else if (this.state.curProduct === PRODUCT.CHILDA) {
      newPath = '/a-' + sensorNum; 
    } else if (this.state.curProduct === PRODUCT.CHILDB) {
      newPath = '/b-' + sensorNum; 
    }

    this.setState({
      redirectPath: newPath
    }); 
  }

  onSave() {
    DatabaseParamStore.commitConfig(this.state.curProduct); 
    this.setState({
      redirectPath: '/selectmode'
    });
  }

  onInputChange(e) {
    this.setState({
      sensorNum: e.target.value
    });
  }
}

export default Radium(TestCalibration);