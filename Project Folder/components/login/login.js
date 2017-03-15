import React, {Component} from 'react';
import render from 'react-dom'
import styles from './login.css';

import Button from 'react-bootstrap/lib/Button';
import './login.css'

import * as firebase from 'firebase';


export default class Login extends React.Component{
  constructor(){
    super();
    this.state = {
      UID:"",
      ACCESS_TOKEN:""
    };

    this.authHandler  = this.authHandler.bind(this);
  }

  componentWillMount(){

  }

  getCredentials(provider){
    this.result = 
    firebase.auth().signInWithPopup(provider)
      .then(this.authHandler)
      .catch(err=> console.error(err))
  }

  authHandler(result){
    if(result.credential){
      console.log(result)
      const token = result.credential.accessToken;
      const user = result.user.email;
      const userRef = firebase.database().ref('users/');

      userRef.push({accessToken: token, username: user});
    
    }
    
  }

  render(){
    return(
      <nav className="login">
      <div className={styles.container}>
        <div className={styles.buttonDiv}>
          <Button onClick={this.getCredentials.bind(this, new firebase.auth.GithubAuthProvider())}
           bsStyle="success" bsSize="large" block>
            Login with GitHub
          </Button>
        </div>
      </div>
      </nav>
    );
  }
}