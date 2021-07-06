// Name: AppStatusStore.js
// Author: Amay Kataria. 
// Date: 07/06/2021
// Description: Data store to hold all the information regarding the status of the application. Currently, it's mode and bluetooth status. 
// Components that need this information subscribe to this store. 

class AppStatusStore {
    constructor() {
        this.mode = 'SETUP'; 
        this.bluetoothStatus = false; 
        this.showLogout = false; 
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
    setMode(newMode) {
        this.mode = newMode; 
        // Kick off the listener
        for (let listener of this.listeners) {
            listener(); 
        }
    }

    setBluetoothStatus(newStatus) {
        this.bleStatus = newStatus; 
        // Kick off the listener
        for (let listener of this.listeners) {
            listener();
        }
    }

    setShowLogout(show) {
        this.showLogout = show; 
        for (let listener of this.listeners) {
            listener();
        }
    } 

    getData() {
        return {
            'mode': this.mode,
            'bleStatus': this.bleStatus,
            'showLogout': this.showLogout
        }; 
    }
}

export default new AppStatusStore(); 