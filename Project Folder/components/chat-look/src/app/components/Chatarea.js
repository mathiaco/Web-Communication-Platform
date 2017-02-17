import React from "react";
import {Chatbox} from "./Chatbox";

export class Chatarea extends React.Component{
  constructor(){
    super();
    this.state = {
      showChat: false
    }
  }
  expand(e){
    e.preventDefault();
    this.setState({showChat: !this.state.showChat})
  }
  render(){
    var people = ["Name1","Name2","Name3"];
    return(
      <div>
          <div className="peopleList">
            <ul>{people.map((people, i) =>
                <li onClick={this.expand.bind(this)}
                value={i} key={i}>
                  {people}
                </li>)}
              </ul>
          </div>
              {this.state.showChat && <Chatbox/>}
      </div>
    );
  }
}
