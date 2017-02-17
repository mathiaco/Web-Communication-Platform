import React from "react";

export class Chatbox extends React.Component{
  constructor(){
    super();
    this.state = {
      text: ""
    };
  }
  // onUpdateChat(){
  //   this.setState({
  //     text: this.state.text
  //   });
  // }

  render(){
    return(
      <div className="chatbox">
          <div className="textarea">
            <p>Text goes here</p>
          </div>
          <div className="textInput">
              <input
                  type="text"
                  className="chatText"/>
          </div>
          <div>
            
          </div>
      </div>
    );
  }
}
