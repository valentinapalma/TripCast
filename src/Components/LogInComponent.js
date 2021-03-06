import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Redirect } from 'react-router-dom';

//This class implemented the Sign up, Log in and Log out functionality
class LogInComponent extends Component {

  constructor (props) {
    super (props);
    //definition and assignment of states that are required for Sign up, Log in and Log out
    this.state = {users: [
      {email: 'admin@gmail.com', password: 'admin'}
    ],
      show: false,
      loginStatus: 'false',
      signupStatus: 'true',
      preLogInChecker: localStorage.getItem('loginStatus'),
      signedUpUser: localStorage.getItem('users')
    };
    //storing the login and signup status
    localStorage.setItem('users', JSON.stringify(this.state.users));
  }

  //method for handling user email input
  handleEmailInput = (e) => {
    this.userEmail = e.target.value;
  }

  //method for handling user password input
  handlePasswordInput = (e) => {
    this.userPassword = e.target.value;
  }

  //method that controls the login functionality
  Login = (e) => {
    let emailCredential;
    let passwordCredential;
    if (this.userEmail !== undefined && this.userPassword !== undefined) {
      JSON.parse(this.state.signedUpUser).find((element) => {
        emailCredential = (element.email === this.userEmail);
        passwordCredential = (element.password === this.userPassword);
      });
    }
    if (emailCredential === true && passwordCredential === true && this.userEmail !== undefined && this.userPassword !== undefined) {
      this.setState((prevState) => ({
        loginStatus: 'true',
        signupStatus: 'false'
      }));
      localStorage.setItem('loginStatus', 'true');
      localStorage.setItem('signupStatus', 'false');
      alert('Login successful:)');
    } else {
      this.setState({loginStatus: 'false', signupStatus: 'false'});
      localStorage.setItem('loginStatus', 'false');
      localStorage.setItem('signupStatus', 'false');
      alert('Login failed! Please signup.');
    }
  }

  //method that controls the signup functionality
  Signup = (e) => {
    let emailCredential;
    let passwordCredential;
    this.state.users.find((element) => {
      emailCredential = (element.email === this.userEmail);
      passwordCredential = (element.password === this.userPassword);
    })
    if (emailCredential === false && passwordCredential === false && this.userEmail !== undefined && this.userPassword !== undefined) {
      this.setState((prevState) => ({
        users: [...prevState.users, {email: this.userEmail, password: this.userPassword}],
        loginStatus: 'false',
        signupStatus: 'true'
      }));
      JSON.parse(localStorage.getItem('users')).find((element) => {
        if (element.email !== this.userEmail && element.password !== this.userPassword) {
          let existingUser = JSON.parse(localStorage.getItem('users'));
          existingUser.push({email: this.userEmail, password: this.userPassword});
          localStorage.setItem('users', JSON.stringify(existingUser));
          this.setState((prevstate) => ({
            signedUpUser: localStorage.getItem('users')
          }));
        }
      });
      localStorage.setItem('loginStatus', 'false');
      localStorage.setItem('signupStatus', 'true');
      alert("Signup successful!");
    } else {
      this.setState({loginStatus: 'false', signupStatus: 'true'});
      localStorage.setItem('loginStatus', 'false');
      localStorage.setItem('signupStatus', 'true');
      alert('Either you are already signed up or you did not properly fill up your credentials!');
    }
  }

  //method that control modal close button
  handleClose = (e) => {
    this.setState({ show: false });
  }

  //method that controls modal show button
  handleShow = (e) => {
    this.setState({ show: true });
  }

  //method that controls the logout functionality
  Logout = (e) => {
    this.setState((prevState) => ({
      loginStatus: 'false',
      signupStatus: 'true'
    }));
    localStorage.setItem('loginStatus', 'false');
    localStorage.setItem('signupStatus', 'true');
    this.userEmail = undefined;
    this.userPassword = undefined;
    this.props.history.push(`/home`);
  }

  //method for controlling render after login
  controlRender = (e) => {
    if (this.state.loginStatus === 'true' && this.props.city !== undefined) {
      return <Redirect to={`/planner/${this.props.city}`} />;
    }
    if (this.state.loginStatus === 'true' && this.props.city === undefined) {
      this.props.history.push(`/mypage`);
    }
  }

  render () {
    return (
      <>
      {this.controlRender()}
          <Button show="primary" onClick={this.handleShow} style={{display:"block", marginLeft:"auto", marginRight:"auto", marginTop:"10px"}}>
          {(this.state.preLogInChecker === 'false') ? 'Login' : 'Logout'}
          </Button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Signup/Login/Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {(this.state.preLogInChecker === 'true') ?
            <Jumbotron>
              <p>Press the following button to log out.</p>
              <Button variant="info" type="submit" onClick= {this.Logout} >Logout</Button>
            </Jumbotron>
            :
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange= {this.handleEmailInput} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange= {this.handlePasswordInput} />
              </Form.Group>
              {(this.state.loginStatus === 'false' && this.state.signupStatus === 'true') ?
              <Button variant="primary" type="submit" onClick= {this.Login} >Login</Button>
               : null
              }
              {(this.state.signupStatus === 'false' && this.state.loginStatus === 'false') ?
                <Button variant="primary" type="submit" onClick= {this.Signup}>Signup</Button>
                : null
              }
              </Form>
        }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default LogInComponent;
