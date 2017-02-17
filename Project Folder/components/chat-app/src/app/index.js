import React from "react";
import { render } from "react-dom";

//components
import {Buttons} from "./components/Button";
import {Chatbox} from "./components/Chatbox";

class App extends React.Component {

getInitialState(){
  return{
    message: [],
    socket: window.io('http://localhost:3000')
    
  }
}

componentDidMount(){
  this.state.socket.on("new-message", function(msg){
    this.setState({message: this.state.messages.push(msg)})
  })
}

  render() {
    return (
      <div className="container">
        <div className="row">
          <Buttons/>
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
