import React from "react";
import { render } from "react-dom";

//components
import {Buttons} from "./components/Button";
import {Chatbox} from "./components/Chatbox";

class App extends React.Component {
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
