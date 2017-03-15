import React, { Component } from "react"
import {render} from "react-dom"
import './App.css';
import Login from './components/login.js'


class App extends React.Component {


  render() {
    return ( 
      <div className="App">
        <Login/>    
      </div>
    );
  }
}

export default App;
