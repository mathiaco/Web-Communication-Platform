import React from "react";
import {Chatbox} from "./Chatbox";

export class Chatarea extends React.Component{
  constructor(){
    super();
    this.state = {
      showChat: false
    }
  }
  onClick(e){
    e.preventDefault();
    this.setState({showChat: !this.state.showChat})
  }
  render(){
    var people = ["Name1","Name2","Name3"];
    return(
      <div className="container">
          <div className="row">
            <ul>{people.map((people, i) =>
                <li key={i}>
                  <a href="#"
                    onClick={this.onClick.bind(this)}
                    value={i}>{people}
                  </a>
                </li>)}
              </ul>
        </div>
        <div className="chatBox">
          {this.state.showChat && <Chatbox/>}
        </div>
      </div>
    );
  }
}
