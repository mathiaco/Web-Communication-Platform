import React from "react";
import {Chatarea} from "./Chatarea";

export class Buttons extends React.Component{
  constructor(){
    super();
    this.state = {
      showPeople: false
    }
  }
  expand(e){
    e.preventDefault();
    this.setState({showPeople: !this.state.showPeople})
  }
  render(){
    return(
      <div className="foot">
        <div>
          {this.state.showPeople && <Chatarea/>}
          <button onClick={this.expand.bind(this)} className="btn btn-primary chatButton">Chat</button>
        </div>
      </div>
    );
  }
}
