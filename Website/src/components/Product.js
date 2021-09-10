// Name: Product.js
// Author: Amay Kataria. 
// Date: 09/09/2021
// Description: Component that helps the user choose a product. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Link, Redirect } from 'react-router-dom';

import ProductStore, {PRODUCT} from '../Stores/ProductStore';
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

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        redirect: false
    };
  }
  
  render() {
    return  this.state.redirect ? <Redirect to="/setup" /> : (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.title}>Product</div>
          <br />
          <div style={styles.info}>Welcome to Embroidered touch. Choose your product.</div>
          <br />
          <div>
            <CustomButton onClick={this.onSweater.bind(this)}>SWEATER</CustomButton>
            <br />
          </div>
          <div>
            <CustomButton onClick={this.onChildA.bind(this)}>CHILDREN A</CustomButton>
            <br />
          </div>
          <div>
            <CustomButton onClick={this.onChildB.bind(this)}>CHILDREN B</CustomButton>
            <br />
          </div>
        </div>
      </div>
    );
  }

  onSweater() {
    ProductStore.setProduct(PRODUCT.SWEATER);
    console.log('Product Set: Sweater');
    this.setState({
        redirect: true
    });
  }

  onChildA() {
    ProductStore.setProduct(PRODUCT.CHILDA);
    console.log('Product Set: Child A');
    this.setState({
        redirect: true
    });
  }

  onChildB() {
    ProductStore.setProduct(PRODUCT.CHILDB);
    console.log('Product Set: Child B');
    this.setState({
        redirect: true
    });
  }
}

export default Radium(Product);