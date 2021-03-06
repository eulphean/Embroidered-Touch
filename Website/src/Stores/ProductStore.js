// Name: ProductStore.js
// Author: Amay Kataria. 
// Date: 09/09/2021
// Description: A simple data store to save the product name. n

export const PRODUCT = {
    'NONE': 0,
    'SWEATER': 1,
    'CHILDA': 2,
    'CHILDB': 3,
}

class ProductStore {
    constructor() {
        this.product = PRODUCT.NONE; 
        this.listeners = [];
    }

    // Returns the method to be called to remove itself as listener. 
    // Component must call that on unmounting. 
    subscribe(listener) {
        this.listeners.push(listener); 
        const removeListener = () => {
            this.listeners = this.listeners.filter((s) => listener !== s);
        };

        return removeListener;
    }

    // Populates the store. 
    setProduct(product) {
        switch(product) {
            case PRODUCT.SWEATER:
                this.product = PRODUCT.SWEATER; 
                break;
            
            case PRODUCT.CHILDA: 
                this.product = PRODUCT.CHILDA; 
                break;
            
            case PRODUCT.CHILDB: 
                this.product = PRODUCT.CHILDB;
                break;
            
            default: 
                break; 
        }

        // Alert all subscribers that the product has changed.
        // Now all the components will have to update based on the new product. 
        // Including App.js
        for (let listener of this.listeners) {
            listener(this.product);
        }
    }

    getProductName() {
        // let name = ''; 
        // if (this.product === PRODUCT.SWEATER) {
        //     name = 'sweater';
        // } else if (this.product === PRODUCT.CHILDA) {
        //     name = 'childA';
        // } else if (this.product === PRODUCT.CHILDB) {
        //     name = 'childB';
        // } else {
        //     console.log('Unknown product.... WAIT and check');
        // }

        // return name; 
        return this.product; 
    }
}

export default new ProductStore();