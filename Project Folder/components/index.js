import React from "react";
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';


  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyC0Xs1ti8UN9LYp_n9cLD3TIR2P_EwvqRw",
    authDomain: "reactchat-767b5.firebaseapp.com",
    databaseURL: "https://reactchat-767b5.firebaseio.com",
    storageBucket: "reactchat-767b5.appspot.com",
    messagingSenderId: "888685675124"
  };
  firebase.initializeApp(config);



//rendering and routing
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
