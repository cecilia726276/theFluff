import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'material-ui/Button';
import Input from './Input.js';
import '../../styles/application.css';
import {Redirect} from 'react-router-dom';
import * as routes from '../../router/routes';
import { Link } from 'react-router-dom';


import { auth } from '../../firebase/firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
  forbiddenWords: ["password"],
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  isConfirmedPassword = (event) =>{
    return (event == this.state.password)
  };

  onSubmit = (event) => {
    const { password } = this.state;

    auth.doPasswordUpdate(password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      password,
      confirmPassword,
      forbiddenWords,
      error,
    } = this.state;

    const isInvalid =
      password !== confirmPassword ||
      password === '';

    return (
      <div className="create_account_screen" id="page_border">
      <div className="create_account_form">
      <a className="forgotPass"><Link to={routes.PASSWORD_FORGET}><p><b style={{fontWeight:'bold'}}>Change My Password </b></p></Link></a>
      </div>
      </div>
    );
  }
}

export default PasswordChangeForm;