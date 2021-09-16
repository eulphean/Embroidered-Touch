// Name: App.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Root class, which is the entry

import React from 'react'
import Radium from 'radium'
import { Redirect, HashRouter as Router, Route, Switch } from 'react-router-dom'

import Product from './Product.js'
import StaticSleeve from './StaticSleeve.js'
import Title from './Title.js'
import Setup from './Setup.js'
import Login from './Login.js'
import Calibration from './Calibration.js'
import SelectMode from './SelectMode.js'
import TestCalibration from './TestCalibration.js'
import ConnectionMode from './ConnectionMode.js'
import Sensor from './Sensor.js'
import ProductStore, {PRODUCT} from '../Stores/ProductStore.js'
import ChildSleeve from './ChildSleeve.js'

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isConnected: false,
      receiveVal: 'Receive Text',
      isLoggedIn: false,
      curProduct: PRODUCT.NONE
    };
  }

  componentDidMount() {
    this.productStoreRemove = ProductStore.subscribe(this.onProductUpdated.bind(this));
  }

  componentWillUnmount() {
    this.productStoreRemove();
  }

  render() {
    
    let loginPage = this.state.isLoggedIn ? <Redirect to="/product" /> : <React.Fragment><StaticSleeve /><Login onLogin={this.hasLoggedIn.bind(this)}/></React.Fragment>;
    // Redirect to test calibration page if we have already calibrated. 
    let productPage = this.state.isLoggedIn ? <React.Fragment><StaticSleeve /><Product /></React.Fragment> : <Redirect to="/" />; 
    // Get the new sleeve design for the following pages. 
    let sleeve = this.getSleeveComponent(); 
    let setupPage = this.state.isLoggedIn ? <React.Fragment>{sleeve}<Setup /></React.Fragment> : <Redirect to="/" />; 
    let calibrationPage = this.state.isLoggedIn ? <React.Fragment>{sleeve}<Calibration /></React.Fragment> : <Redirect to="/" />
    let calibrationPages = this.getSensorCalibrationPages(); 
    let testCalPage = this.state.isLoggedIn ? <React.Fragment><TestCalibration /></React.Fragment> : <Redirect to="/" />;
    let selectModePage = this.state.isLoggedIn ? this.getSelectMode() : <Redirect to="/" />;
    let connectionModePage = this.state.isLoggedIn ? this.getConnectionMode() : <Redirect to="/" />;

    return (
      <div style={styles.container}>
        <Title onLogout={this.logOut.bind(this)} />
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              {calibrationPages}
              <Route path="/connection">{connectionModePage}</Route>
              <Route path="/selectmode">{selectModePage}</Route>
              <Route path="/testcal">{testCalPage}</Route>
              <Route path="/calibration">{calibrationPage}</Route>
              <Route path="/setup">{setupPage}</Route>
              <Route path="/product">{productPage}</Route>
              <Route path="/">{loginPage}</Route>
            </Switch>
        </Router>
      </div>
    );
  }

  getSleeveComponent() {
    switch (this.state.curProduct) {
      case PRODUCT.SWEATER: 
        return <StaticSleeve />;

      case PRODUCT.CHILDA: 
        return <ChildSleeve isChildA={true} />;

      case PRODUCT.CHILDB: 
        return <ChildSleeve isChildA={false} />;
    }
  }

  onProductUpdated(product) {
    console.log('Product Updated: ' + product); 
    this.setState({
      curProduct: product
    });
  }

  getConnectionMode() {
    return (
      <React.Fragment>
        <ConnectionMode />
      </React.Fragment>
    );
  }

  getSelectMode() {
    return (
      <React.Fragment>
        <SelectMode />
      </React.Fragment>
    );
  }

  getSensorCalibrationPages() {
    if (this.state.curProduct === PRODUCT.SWEATER) {
      return this.getSweaterCalibration();
    } else if (this.state.curProduct === PRODUCT.CHILDA) {
      return this.getChildCalibration(true); 
    } else if (this.state.curProduct === PRODUCT.CHILDB) {
      return this.getChildCalibration(false);
    }
  }

  getChildCalibration(isChildA) {
    let pages = []; 
    let pathPrefix;
    if (isChildA) { // 4 sleeve.
      for (let i=1; i <=4; i++) {
        pathPrefix = '/a-'; 
        let path = pathPrefix + i; 
        let component = this.state.isLoggedIn ? (
          <React.Fragment>
            <ChildSleeve 
              isChildA={true}
              sensorIdx={i} 
            />
            <Sensor sensorIdx={i}/>
          </React.Fragment> 
        ) : (<Redirect key={'a-' + i} to='/' />); 

        let route = <Route key={'keyA:' + i} path={path}>{component}</Route>;
        pages.push(route); 
      }
    } else { // 7 sleeve. 
      pathPrefix = '/b-';
      for (let i=1; i <=7; i++) {
        let path = pathPrefix + i; 
        let component = this.state.isLoggedIn ? (
          <React.Fragment>
            <ChildSleeve 
              isChildA={false} 
              sensorIdx={i}/>
            <Sensor sensorIdx={i}/>
          </React.Fragment> 
        ) : (<Redirect key={'b-' + i} to='/' />); 

        let route = <Route key={'keyB:' + i} path={path}>{component}</Route>;
        pages.push(route); 
      }
    }

    return pages; 
  }

  getSweaterCalibration() {
    // Left sleeve....
    let pathPrefix = '/l-';
    let pages=[]; 
    for (let i=1; i <= 12; i++) {
      let path = pathPrefix + i; 
      let component = this.state.isLoggedIn ? (
        <React.Fragment>  
          <StaticSleeve 
            chipsetId={0}
            sensorIdx={i}
          />
          <Sensor 
            chipsetId={0}
            sensorIdx={i}
            key={'keyL:' + i}
          >
          </Sensor>
        </React.Fragment>
      ) : (<Redirect key={'l-' + i} to='/' />);

      let route = <Route key={'keyL:' + i} path={path}>{component}</Route>
      pages.push(route);
    }

    // Right sleeve....
    pathPrefix = '/r-'; 
    for (let i = 13; i <= 24; i++) {
      let path = pathPrefix + i; 
      let component = this.state.isLoggedIn ? (
        <React.Fragment>
          <StaticSleeve 
            chipsetId={1}
            sensorIdx={i}
          />
          <Sensor
            chipsetId={1}
            sensorIdx={i}
            key={'keyR:' + i}
          >
          </Sensor>
        </React.Fragment>
      ) : (<Redirect key={'r-' + i} to='/' />);

      let route = <Route key={'keyR:' + i} path={path}>{component}</Route>
      pages.push(route); 
    }

    return pages; 
  }

  hasLoggedIn(state) {
    this.setState({
      isLoggedIn: state
    });
  }

  logOut() {
    this.setState({
      isLoggedIn: false
    });
  }
}

export default Radium(App);