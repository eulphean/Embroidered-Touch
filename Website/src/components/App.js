import React from 'react'
import Radium from 'radium'
import HalfCircleButton, { CircleType } from './HalfCircleButton.js'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import LiveInfo from './LiveInfo.js'
import Popup, {PopupType} from './Popup.js'
import VideoStream from './VideoStream.js'
import { withOrientationChange } from 'react-device-detect'
import Websocket from './Websocket.js'
import Printer from './Printer.js'

const styles = {
  container: {
    position: 'relative'
  },

  buttonWrapper: {
    position: 'fixed',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '30'
  },

  topButton: {
    display: 'flex',
    alignItems: 'center',
    opacity: '0.9'
  },

  bottomButton: {
    display: 'flex',
    alignItems: 'center',
    opacity: '0.9'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      imageSrc: '',
      popupType: PopupType.About,
      showButtons: true,
      receipts: {}
    };

    this.websocket = React.createRef(); 
    this.popupRef = React.createRef(); 
    this.timeoutDuration = 5000; 
    this.buttonTimeout = setTimeout(this.hideButtons.bind(this), this.timeoutDuration); 
  }

  render() {
    let content = this.getContent(); 
    return (
      <div onClick={this.onTouch.bind(this)} onTouchStart={this.onTouch.bind(this)} style={styles.container}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/printer"><Printer /></Route>
            <Route path="/">{content}</Route>
          </Switch>
        </Router>
      </div>
    );
  }

  getContent() {
    return (
      <div>
        <Websocket 
          ref={this.websocket}
          processEntries={this.entriesReceived.bind(this)}
        /> 
        <LiveInfo />
        <div style={styles.buttonWrapper}>
          <HalfCircleButton 
            key={'About'}
            show={this.state.showButtons}
            onClick={this.handleClick.bind(this)}
            shape={CircleType.Top} 
            style={styles.bottomButton}>About</HalfCircleButton>
          <HalfCircleButton 
            key={'Send'}
            show={this.state.showButtons}
            onClick={this.handleClick.bind(this)} 
            shape={CircleType.Bottom} 
            style={styles.topButton}>Send</HalfCircleButton>
        </div>
        <VideoStream ref={this.videoStream} />
        <Popup 
          ref={this.popupRef}
          onClose={this.handlePopupClose.bind(this)}
          onSend={this.handleSendMessage.bind(this)}
          type={this.state.popupType} 
          receipts={this.state.receipts}/>
      </div>
    ); 
  }

  onStreamImage(data) {
    let src = 'data:image/jpeg;base64,' + data
    this.setState({
      imageSrc: src
    }); 
  }

  emitMessage(text) {
    this.websocket.current.sendMessage(text); 
  }

  handlePopupClose() {
    this.setState({
      showButtons: true
    }); 

    // Enable timeout again. 
    this.buttonTimeout = setTimeout(this.hideButtons.bind(this), this.timeoutDuration); 
  }

  handleClick(event, type) {
    event.stopPropagation();

    // Remove any hiding timeout because the buttons are hiding anyways. 
    clearTimeout(this.buttonTimeout);

    // Request some random data to show as receipts
    // from the hosted database. 
    if (type === 'Send') {
      console.log('send');
      this.websocket.current.requestData(); 
    }

    let popupType = (type === 'About') ? PopupType.About : PopupType.Send;
    // Set popup type based on the button click. 
    this.setState({
      popupType: popupType,
      showButtons: false
    });

    // Show popup. 
    this.popupRef.current.showPopup();
  }

  entriesReceived(payload) {
    this.setState({
      receipts: payload
    });
  }

  onTouch() {
    // Clear previous timeout, set new timeout. 
    clearTimeout(this.buttonTimeout); 
    this.buttonTimeout = setTimeout(this.hideButtons.bind(this), this.timeoutDuration); 

    this.setState({
      showButtons: true
    }); 
  }

  hideButtons() {
    this.setState({
      showButtons: false
    }); 
  }

  handleSendMessage(content) {
    this.websocket.current.sendMessage(content); 
  }
}

export default Radium(withOrientationChange(App));