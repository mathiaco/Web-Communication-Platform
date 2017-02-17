import React from "react";
import {Chatarea} from "./Chatarea";

export class Buttons extends React.Component{
  constructor(){
    super();
    this.state = {
      showPeople: false
    }
  }
  onClick(e){
    e.preventDefault();
    this.setState({showPeople: !this.state.showPeople})
  }
  render(){
    return(
      <div>
        <button onClick={this.onClick.bind(this)} className="btn btn-primary">Chat</button>
        {this.state.showPeople && <Chatarea/>}
    </div>
    );
  }
}
