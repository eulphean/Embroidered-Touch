import React from 'react'
import Radium from 'radium'

const styles = {
  container: {
    position: 'relative'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };
  }

  render() {
    return (
      <div>
        Hello content how are you?
        I am good react-content is looking sharp hello.
      </div>
    );
  }
}

export default Radium(App);